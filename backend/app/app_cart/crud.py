
from sqlalchemy.orm import Session
from app.app_cart.models import Coupon
from app.app_cart.schemas import CouponCreate, CouponUpdate,CouponResponse
from app.common.schemas import PaginationResponse
from app.app_cart.models import Cart,CartItem
from app.app_users.models import User
def create_coupon(db: Session, data: CouponCreate):
    coupon = Coupon(**data.dict())
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon

def get_coupon(db: Session, coupon_id):
    return db.query(Coupon).filter(Coupon.id == coupon_id).first()

def get_coupon_by_code(db:Session,code):
    return db.query(Coupon).filter(Coupon.code==code).first()

def update_coupon(db: Session, coupon, data: CouponUpdate):
    for key, value in data.dict(exclude_unset=True).items():
        setattr(coupon, key, value)
    db.commit()
    db.refresh(coupon)
    return coupon

def delete_coupon(db: Session, coupon):
    db.delete(coupon)
    db.commit()
    return True

def get_list_of_coupons(db: Session, page, size,search):
    skip = (page - 1) * size
    query = db.query(Coupon)
    query = query.order_by(Coupon.created_at.desc())
    if search:
        query = query.filter(
            Coupon.code.ilike(f"%{search}%"),
        
        )
    total = query.count()
    items = query.offset(skip).limit(size).all()
    has_next = skip + size < total
    has_prev = page > 1
    return PaginationResponse[CouponResponse](
    items=items,
    page=page,
    size=size,
    has_next=has_next,
    has_prev=has_prev,
    total=total,
    )


# cart crud

def get_cart_by_user_id(db:Session,user_id):
    return db.query(Cart).filter(Cart.user_id == user_id).first()

def create_cart(db:Session,user:User):
    db_cart = Cart(
        user_id=user.id
    )
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

def get_or_create_cart(db:Session,user:User):
    db_cart = get_cart_by_user_id(db,user.id)
    if not db_cart:
        # crete the cart
        db_cart = create_cart(db,user)
    return db_cart



def get_cart_item(db:Session,cart_id,product_id):
    return db.query(CartItem).filter(CartItem.product_id==product_id,CartItem.cart_id == cart_id).first()

def get_cart_item_by_id(db:Session,cart_item_id):
    return db.query(CartItem).filter(CartItem.id == cart_item_id).first()

def create_cart_item(db:Session,data):
    db_cart_item = CartItem(**data)
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

def update_cart_item(db:Session,db_cart_item,update_data):
    for key,value in update_data.items():
        setattr(db_cart_item,key,value)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item



def delete_cart_item(db:Session,db_cart_item):
    db.delete(db_cart_item)
    db.commit()
    return None

def update_cart(db:Session,db_cart,updated_data):
    for key,value in updated_data.items():
        setattr(db_cart,key,value)
    db.commit()
    db.refresh(db_cart)
    return db_cart