

from fastapi import APIRouter, Depends, HTTPException, status,Query,Path
from sqlalchemy.orm import Session
from app.core.deps import get_db, is_admin,get_current_user
from app.app_users.models import User
from app.app_cart.crud import get_cart_by_user_id
import app.app_order.crud as crud_order
import razorpay
from app.core.config import settings
from typing import List,Optional
from app.app_order.schemas import OrderResponse,TransactionUpdate,OrderUserResponse,OrderStatusUpdate
from app.common.schemas import PaginationResponse
from fastapi_limiter.depends import RateLimiter

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET))

app = APIRouter()

@app.post('/checkout/verify',dependencies=[Depends(RateLimiter(times=20, seconds=60))])
def verify_cart_before_checkout(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db_cart = get_cart_by_user_id(db, user.id)
    if not crud_order.verify_cart_stock(db, db_cart):
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="One or more products in your cart are out of stock or unavailable. Please review your cart and try again."
        )
    return {'detail':"Verified your cart proceed to checkout page"}

@app.post('/place-order/payment-request',dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def create_razorpay_transaction(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
  
  db_cart = get_cart_by_user_id(db, user.id)
  if not db_cart or not db_cart.items:
    raise HTTPException(status_code=400, detail="Cart is empty")
  if not crud_order.verify_cart_stock(db, db_cart):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="One or more products in your cart are out of stock or unavailable. Please review your cart and try again."
    )
  
  # verify applied coupon too 
  subtotal = crud_order.calculate_cart_subtotal(db,db_cart)
  if db_cart.coupon and subtotal < db_cart.coupon.min_order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cart total must be at least {db_cart.coupon.min_order} to use this coupon."
        )
  
  subtotal, tax, discount, total = crud_order.calculate_cart_totals(db,db_cart)
  shipping_charge = 0 if subtotal >= 2000 else 200
  total = shipping_charge + total
  data = {
    "subtotal":subtotal,
    "shipping_charge":shipping_charge,
    "tax":tax,
    "total":total,
    "discount":discount,
    "user_id":user.id
  }
  db_order = crud_order.create_order(db, user, db_cart, data)
  razorpay_order = razorpay_client.order.create({
        "amount": int(total * 100),  # Razorpay uses paise
        "currency": "INR",
        "payment_capture": "1"
    })
  transaction_data = {
    "transaction_id":razorpay_order["id"],
    "amount":total,
    "payment_method":"razorpay",
    "status":"created",
    "order_id":db_order.id,
    "transaction_metadata":razorpay_order
  }
  crud_order.create_transaction(
        db,
        transaction_data
    )
  
  #  hold product stock to avoid conflict
  crud_order.hold_cart_product_stock(db,db_cart)
  return {
        "order_id": str(db_order.id),
        "razorpay_order_id": razorpay_order["id"],
        "amount": total,
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID
    }

@app.get('/transaction/{transaction_id}/verify}')
def verify_razorpay_transaction(transaction_id:str,db:Session = Depends(get_db),user:User=Depends(get_current_user)):
    db_transaction = crud_order.get_transaction_by_id(db,transaction_id)
    if not db_transaction  :
        raise HTTPException(status_code=404,detail='Transaction not found')
    if db_transaction.status == 'created':
        raise HTTPException(status_code=400,detail='Transaction waiting for verification')
    if db_transaction.status == 'failed':
        raise HTTPException(status_code=402,detail='Transaction already verified')
    return {'detail':'Transaction Verified'}


@app.put('/transaction/{transaction_id}}')
def update_transaction_status(transaction_id:str,data:TransactionUpdate,db:Session = Depends(get_db),user:User=Depends(get_current_user)):
    db_transaction = crud_order.get_transaction_by_id(db,transaction_id)

    if data.status in ['paid',"failed"]:
        db_transaction.status = data.status
        db.commit()
        db.refresh(db_transaction)
    return {'detail':'Transaction Verified'}


@app.post('/razorpay-webhook')
def razorpay_webhook(payload: dict, db: Session = Depends(get_db)):
    """Step 2: Razorpay Webhook → confirm payment or mark failed"""
    try:
        event = payload.get("event")
        data = payload.get("payload", {})

        if event == "payment.captured":
            razorpay_order_id = data["payment"]["entity"]["order_id"]
            payment_id = data["payment"]["entity"]["id"]

            crud_order.mark_payment_success(db, razorpay_order_id, payment_id)
            crud_order.clear_cart(db,razorpay_order_id)
        elif event == "payment.failed":
            razorpay_order_id = data["payment"]["entity"]["order_id"]
            crud_order.mark_payment_failed(db, razorpay_order_id)

    except Exception as e:
        print(f"Error occurred while processing webhook: {e}")
        raise HTTPException(status_code=400, detail=f"Webhook handling failed: {str(e)}")

    return {"status": "ok"}


@app.get('/list',response_model=PaginationResponse[OrderUserResponse])
def get_orders_list(
    page:int = Query(1,ge=1),
    size:int = Query(10,ge=1),
    sort_by_date:str =Query("desc",regex="^(asc|desc)$"),
    db:Session=Depends(get_db),
    search: Optional[str] = Query(None, description="Search in order"),
    user:User=Depends(get_current_user)
    ):
    return crud_order.get_list_of_orders(db,user.id,page,size,sort_by_date,search)


@app.get('/admin/list',response_model=PaginationResponse[OrderResponse],dependencies=[Depends(is_admin)])
def get_orders_list(
    page:int = Query(1,ge=1),
    size:int = Query(10,ge=1),
    sort_by_date:str =Query("desc",regex="^(asc|desc)$"),
    db:Session=Depends(get_db),
    search: Optional[str] = Query(None, description="Search in order")    ):
    return crud_order.get_list_of_orders(db,None,page,size,sort_by_date,search)

@app.delete("/{order_id}")
def delete_order(order_id:str,db:Session=Depends(get_db),user:User=Depends(is_admin)):
    crud_order.delete_order_by_id(db,order_id)
    return {'detail':'Deleted Successfully'}


@app.put("/status/{order_id}",dependencies=[Depends(is_admin)])
def update_order_status(order_id:str,data:OrderStatusUpdate,db:Session=Depends(get_db),user:User=Depends(is_admin)):
    db_order = crud_order.get_order_by_id(db,order_id)
    if not db_order:
        raise HTTPException(status_code=404,detail='Order Not Found')
    print(data)
    crud_order.update_order(db,db_order,data.dict())
    return {'detail':'Updated Successfully'}
