from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import UploadFile
from app.app_product.models import *
import uuid
import os
from app.app_product.schemas import *
from app.lib.upload import upload_file,delete_file
from app.common.schemas import PaginationResponse
from datetime import timedelta
from sqlalchemy import func
from app.app_order.models import OrderItem

def get_product_by_code(db:Session,code):
  return db.query(Product).filter(Product.code == code).first()

def get_product_by_id(db: Session, id, is_admin: bool):
    query = db.query(Product).filter(Product.id == id)
    if not is_admin:
        query = query.filter(Product.active == True)

    product = query.first()

    if product:
        # calculate review count and average rating
        review_data = (
            db.query(
                func.count(OrderItem.id).label("review_count"),
                func.avg(OrderItem.rating).label("avg_rating"),
            )
            .filter(OrderItem.product_id == product.id, OrderItem.rating != None)
            .first()
        )

        product.review_count = review_data.review_count or 0
        product.avg_rating = float(review_data.avg_rating) if review_data.avg_rating else None

    return product

def create_product(db:Session,data):
  db_product = Product(**data)
  return db_product

def upload_product_image(db:Session,file:UploadFile,product_id:str):
  folder = "products"
  filename = f"{uuid.uuid4().hex}"
  file_path = upload_file(file,folder,filename)
  db_product_images = ProductImage(
    path=file_path,
    alt="Product Image",
    product_id=product_id
  )
  print('created',filename)
  return db_product_images


def get_product_image_by_id(db:Session,id):
  return db.query(ProductImage).filter(ProductImage.id == id).first()
def delete_product_image(db:Session, id):
  db_product_image = get_product_image_by_id(db,id)
  if not db_product_image:
    return True
  delete_file(db_product_image.url)
  db.delete(db_product_image)
  db.commit()
  return True

def update_product(db:Session,db_product,update_data:dict):
  for key,value in update_data.items():
    setattr(db_product,key,value)
  return db_product

def get_list_of_product(db:Session,page,size,filter,search,is_admin=False):
  skip = (page - 1) * size
  query = db.query(Product)
  if(not filter):
    query = query.order_by(Product.updated_at.desc())
  if(is_admin==False):
    query = query.filter(Product.active==True)

  if search:
    query = query.filter(
      or_(
        Product.title.ilike(f"%{search}%"),
        Product.description.ilike(f"%{search}%"),
        Product.code.ilike(f"%{search}%"),
      )
    )
  if filter == "featured":
    query = query.filter(Product.featured == True)
  elif filter == "new_arrivals":
    query = query.filter(Product.created_at >= datetime.now() - timedelta(days=30))
  elif filter == "lowest_first":
    query = query.order_by(Product.price.asc())
  elif filter == "highest_first":
    query = query.order_by(Product.price.desc())
  
  total = query.count()
  print(skip,size,total)
  products = query.offset(skip).limit(size).all()
  items = []
  has_next = skip + size < total
  has_prev = page > 1
  if(not is_admin):
    print(len(products),products)

    for product in products:


      first_image_url = product.images[0].url if product.images else "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
      items.append(
        ProductListResponse(
          id=product.id,
          title=product.title,
          code=product.code,
          actual_price=product.actual_price,
          price=product.price,
          image=first_image_url,
          stock=product.stock
        )
      )
    return PaginationResponse[ProductListResponse](
    items=items,
    page=page,
    size=size,
    has_next=has_next,
    has_prev=has_prev,
    total=total,
  )
  else:
    for product in products:
      
      total_sold = sum(item.qty for item in product.order_items)
      item_response = ProductAdminListResponse.from_orm(product)
      item_response.total_sold = total_sold
      items.append(item_response)
    return PaginationResponse[ProductAdminListResponse](
    items=items,
    page=page,
    size=size,
    has_next=has_next,
    has_prev=has_prev,
    total=total,
  )