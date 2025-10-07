# app_coupon/routes.py
from fastapi import APIRouter, Depends, HTTPException, status,Query,Path
from sqlalchemy.orm import Session
import app.app_cart.crud as crud_cart
from app.common.schemas import PaginationResponse
from app.app_cart.schemas import *
from app.core.deps import get_db, is_admin,get_current_user
from app.app_users.models import User
from app.app_product.crud import get_product_by_id
from sqlalchemy import func, extract
from app.app_order.models import Order,OrderItem
from app.app_product.models import Product

from calendar import month_abbr

router_coupon = APIRouter()
router_cart = APIRouter()
router_admin= APIRouter()

@router_coupon.post("", response_model=CouponResponse, dependencies=[Depends(is_admin)])
def create_coupon(data: CouponCreate, db: Session = Depends(get_db)):
    return crud_cart.create_coupon(db, data)

@router_coupon.get("/list", response_model=PaginationResponse[CouponResponse],dependencies=[Depends(is_admin)])
def list_coupons(
    page:int = Query(1,ge=1),
    size:int = Query(10,ge=1),
    search: Optional[str] = Query(None, description="Search in title or description"),
    db:Session=Depends(get_db)
    ):
    return crud_cart.get_list_of_coupons(db,page,size,search)

@router_coupon.put("/{coupon_id}", response_model=CouponResponse, dependencies=[Depends(is_admin)])
def update_coupon(coupon_id: str, data: CouponUpdate, db: Session = Depends(get_db)):
    coupon = crud_cart.get_coupon(db, coupon_id)
    if not coupon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
    coupon = crud_cart.update_coupon(db, coupon, data)
    return coupon

@router_coupon.delete("/{coupon_id}", status_code=204, dependencies=[Depends(is_admin)])
def delete_coupon(coupon_id: str, db: Session = Depends(get_db)):
    coupon = crud_cart.get_coupon(db, coupon_id)
    if not coupon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
    crud_cart.delete_coupon(db, coupon)
    return { "detail":"Coupon deleted successfully" }

@router_cart.post('',response_model=CartItemResponse)
def add_product_to_cart(
    data: CartItemCreate,
    db:Session=Depends(get_db),
    user:User=Depends(get_current_user),
):
    # first create or get the cart
    db_cart  = crud_cart.get_or_create_cart(db,user)

    # next check the product and qnt 
    db_product = get_product_by_id(db,data.product_id,False)

    if not db_product:
        raise HTTPException(
            detail="Product not found",
            status_code=404
        )

    if data.qty > db_product.stock:
        raise HTTPException(
            detail="Chosen stock is not available",status_code=400
        )
    
    # check this product already in cart
    db_cart_item = crud_cart.get_cart_item(db,db_cart.id,db_product.id)
    if db_cart_item:
        # then update it 
        total_qnt = data.qty + db_cart_item.qty
        print(total_qnt,db_product.stock)
        new_quantity = total_qnt if db_product.stock >= total_qnt else db_product.stock
        total_price = db_product.price * new_quantity
        update_data = {
            "qty":new_quantity,
            "price":total_price
        }
        db_cart_item = crud_cart.update_cart_item(db,db_cart_item,update_data)
    else:
        total_price = db_product.price * data.qty
        create_data = {
            "qty":data.qty,
            "cart_id":db_cart.id,
            "product_id":db_product.id,
            "price":total_price,
        }
        db_cart_item = crud_cart.create_cart_item(db,create_data)
    return db_cart_item

@router_cart.delete('/{cart_item_id}')
def delete_item_from_cart(cart_item_id=Path(...),db:Session=Depends(get_db),user:User =  Depends(get_current_user)):
    # get cart item 
    db_cart_item = crud_cart.get_cart_item_by_id(db,cart_item_id)
    if not db_cart_item:
        raise HTTPException(detail="Cart Item not found",status_code=404)
    crud_cart.delete_cart_item(db,db_cart_item)
    db_cart = crud_cart.get_or_create_cart(db,user)
    db_cart.coupon = None
    db.commit()
    db.refresh(db_cart)
    return {
        'detail':"Cart Item deleted successfully"
    }

@router_cart.get('',response_model=CartOut)
def get_cart(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    return crud_cart.get_or_create_cart(db,user)

# apply coupon to cart
@router_coupon.post('/apply',response_model=CouponResponse)
def apply_coupon(
    data:CouponApply,
    db:Session=Depends(get_db),
    user:User  = Depends(get_current_user)
):
    # check this coupon exist or not
    db_coupon = crud_cart.get_coupon_by_code(db,data.code)
    if not db_coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="Invalid Coupon Code"
        )
    db_cart = crud_cart.get_cart_by_user_id(db,user.id)

    # calculate the total cart price
    total = 0
    for item in db_cart.items:
        total += item.price

    # check the price is greater than min order
    if total < db_coupon.min_order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cart total must be at least {db_coupon.min_order} to use this coupon."
        )
    if db_coupon.used_count >= db_coupon.max_uses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This coupon has been used maximum times.",
        )
    if db_coupon.expires_at <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This coupon has expired.",
        )
    # now add the coupon to the cart
    update_data = {
        'coupon_id':db_coupon.id
    }
    crud_cart.update_cart(db,db_cart,update_data)
    return db_coupon



@router_admin.get('/dashboard')
def get_admin_dashboard(db: Session = Depends(get_db)):
    total_products = db.query(func.count(Product.id)).scalar()
    total_users = db.query(func.count(User.id)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    total_sales = (
        db.query(func.coalesce(func.sum(OrderItem.unit_price * OrderItem.qty), 0))
        .scalar()
    )

    current_year = func.extract("year", func.now())
    monthly_sales = (
        db.query(
            extract("month", Order.created_at).label("month"),
            func.coalesce(func.sum(OrderItem.unit_price * OrderItem.qty), 0).label("sales"),
        )
        .join(OrderItem, OrderItem.order_id == Order.id)
        .filter(extract("year", Order.created_at) == current_year)
        .group_by("month")
        .order_by("month")
        .all()
    )

    # Convert DB results to dict {month: sales}
    monthly_sales_dict = {int(month): float(sales) for month, sales in monthly_sales}

    # Build fixed 12 months output
    sales_overview = [
        {"month": month_abbr[m], "sales": monthly_sales_dict.get(m, 0.0)}
        for m in range(1, 13)
    ]

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_sales": float(total_sales),
        "total_users": total_users,
        "sales_overview": sales_overview,
    }