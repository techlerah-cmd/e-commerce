
from app.app_order.models import *
from app.app_order.schemas import *
from app.app_cart.models import Cart,CartItem,Coupon
from app.app_users.models import User
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.app_product.crud import get_product_by_id
from app.app_users.models import Address
from app.common.schemas import PaginationResponse
from decimal import Decimal
def get_order_by_id(db:Session,id:int):
    return db.query(Order).filter(Order.id == id).first()
def get_transaction_by_transaction_id(db: Session, transaction_id: str):
    return db.query(OrderTransaction).filter(OrderTransaction.transaction_id == transaction_id).first()

def delete_order_by_id(db:Session,id:int):
    db_order = get_order_by_id(db,id)
    if db_order:
        db.delete(db_order)
        db.commit()
        return {"message":"Order Deleted Successfully"}     
    return  
def generate_order_number(db:Session):
    # Get the max order_number and increment
    last_order = db.query(Order).order_by(Order.created_at.desc()).first()
    if last_order and last_order.order_number and last_order.order_number.isdigit():
        return str(int(last_order.order_number) + 1)
    return "1250"

def verify_cart_stock(db:Session,cart:Cart):
    items:List[CartItem] = cart.items
    for item in items:
      db_product = get_product_by_id(db,item.product_id,is_admin=False)
      if not db_product or db_product.stock < item.qty:
          return False
    return True

def calculate_cart_subtotal(db:Session,db_cart:Cart):
    items:List[CartItem] = db_cart.items
    subtotal = 0
    for item in items:
        subtotal += item.price
    return subtotal
def calculate_cart_totals(db:Session,db_cart:Cart):
    items:List[CartItem] = db_cart.items
    db_coupon:Coupon = db_cart.coupon
    subtotal = calculate_cart_subtotal(db,db_cart)
    tax = 0
    discount = 0
    if db_coupon:
        if db_coupon.discount_type == "percent":
            discount = subtotal * (db_coupon.discount_value/100)
        else:
            discount = db_coupon.discount_value
    total = subtotal + tax - discount
    return subtotal,tax,discount,total

def clear_cart(db:Session,transaction_id):
    transaction = db.query(OrderTransaction).filter(OrderTransaction.transaction_id == transaction_id).first()
    order:Order = transaction.order
    user:User = order.user
    db_cart = user.cart
    db.delete(db_cart)
    db.commit()

def create_order(db:Session,user:User,db_cart:Cart,data:dict):
    data['order_number'] = generate_order_number(db)
    data['status'] = "payment_pending"
    address:Address = user.address
    snapshot = {
            "full_name": address.full_name,
            "phone": address.phone,
            "street": address.street,
            "city": address.city,
            "state": address.state,
            "country": address.country,
            "postcode": address.postcode,
            "landmark": address.landmark,
        }
    data['shipping_address'] = snapshot
    db_order = Order(**data)
    db.add(db_order)
    db.flush()
    cart_items:List[CartItem] = db_cart.items
    order_items = []
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=cart_item.product_id,
            name=cart_item.product.title,
            qty=cart_item.qty,
            unit_price=cart_item.product.price,
            total_price=cart_item.price,
        )
        order_items.append(order_item)
        db.add(order_item)

    # create order address
    
    

    db.commit()
    db.refresh(db_order)
    for item in order_items:
        db.refresh(item)
    return db_order

def create_transaction(db:Session,create_data):
    db_transaction = OrderTransaction(**create_data)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def mark_payment_success(db:Session,razorpay_order_id,payment_id):
    transaction = db.query(OrderTransaction).filter(OrderTransaction.transaction_id == razorpay_order_id).first()
    if transaction:
        transaction.status = "paid"
        transaction.transaction_metadata["payment_id"] = payment_id
        transaction.order.status = "payment_paid"
        db.commit()
    # clear cart items

def mark_payment_failed(db: Session, razorpay_order_id: str):
    transaction = db.query(OrderTransaction).filter(OrderTransaction.transaction_id == razorpay_order_id).first()
    if transaction:
        transaction.status = "failed"
        transaction.order.status = "payment_failed"
        db.commit()
        
    # restore the stock again
    db_order:Order = transaction.order
    db_user:User = db_order.user
    db_cart:Cart = db_user.cart
    restore_product_stock(db,db_cart)

def restore_product_stock(db:Session,cart:Cart):
    cart_items:List[CartItem] = cart.items
    updated_product = []
    for item in cart_items:
        product = item.product
        product.stock += item.qty
        updated_product.append(product)
    # decrement the coupon used count
    coupon = None
    if cart.coupon:
        coupon = cart.coupon
        coupon.used_count -= 1
    db.commit()
    for product in updated_product:
        db.refresh(product)
    db.refresh(coupon)

def hold_cart_product_stock(db:Session,cart:Cart):
    cart_items: List[CartItem] = cart.items
    updated_products = []
    for item in cart_items:
        product = item.product
        product.stock = product.stock - item.qty if (product.stock - item.qty ) >= 0 else 0
        updated_products.append(product)
    # also increment th coupon usage
    coupon  = None
    if cart.coupon:
        coupon = cart.coupon
        coupon.used_count += 1
    
    db.commit() 
    if coupon:
        db.refresh(coupon)
    for product in updated_products:
        db.refresh(product)

def get_transaction_by_id(db:Session,transaction_id:str):
    return db.query(OrderTransaction).filter(OrderTransaction.transaction_id == transaction_id).first()


def update_order(db:Session,db_order,update_data:dict):
    for attr,value in update_data.items():
        setattr(db_order,attr,value)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_list_of_orders(db:Session,user_id,page,size,sort_by_date,search):
    skip = (page - 1) * size
    if user_id :
        query = db.query(Order).filter(Order.user_id==user_id)
    else:
        query = db.query(Order)
    if search:
        query = query.filter(
            Order.order_number.ilike(f"%{search}%"),
        )
    if sort_by_date == "asc":
        query = query.order_by(Order.created_at.asc())
    else:
        query = query.order_by(Order.created_at.desc())
    
    total = query.count()

    orders = query.offset(skip).limit(size).all()
    has_next = skip + size < total
    has_prev = page > 1
    if(user_id):
        return PaginationResponse[OrderUserResponse](
        items=[OrderUserResponse.from_orm(order) for order in orders],
        page=page,
        size=size,
        has_next=has_next,
        has_prev=has_prev,
        total=total,
    )
    else:
        return PaginationResponse[OrderResponse](
        items=[OrderResponse.from_orm(order) for order in orders],
        page=page,
        size=size,
        has_next=has_next,
        has_prev=has_prev,
        total=total,
    )


def _order_items_to_products(order):
    """
    Convert order.items (OrderItem objects) to list of dicts expected by send_order_confirmation_email:
    {"name", "quantity", "unit_price", "total_price"}.
    """
    products = []
    for it in order.items:
        # unit_price and total_price are Numeric/Decimal in DB; convert to float for email formatting
        unit_price = float(it.unit_price) if isinstance(it.unit_price, (Decimal,)) else float(it.unit_price or 0)
        total_price = float(it.total_price) if isinstance(it.total_price, (Decimal,)) else float(it.total_price or unit_price * it.qty)
        products.append({
            "name": it.name or "Unknown",
            "quantity": int(it.qty or 1),
            "unit_price": unit_price,
            "total_price": total_price,
        })
    return products
