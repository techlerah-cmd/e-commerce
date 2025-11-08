from sqlalchemy.orm import Session
from sqlalchemy import or_,func, case, desc
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
import re
from decimal import Decimal

from typing import List
def get_product_by_code(db:Session,code):
  return db.query(Product).filter(Product.code == code).first()


def get_related_products(
    db: Session,
    product_id: str,
    limit: int = 4
) -> List[dict]:
    product = db.query(Product).filter(Product.id == product_id).one_or_none()
    if not product:
        return []

    collection_val = (product.collection or "").lower()
    category_val = (product.category or "").lower()

    title_words = re.findall(r"\w+", product.title or "")
    title_words = [w for w in title_words if len(w) > 2][:6]

    # scoring expression
    score_expr = case(
        [(func.lower(Product.collection) == collection_val, 50)],
        else_=0
    )
    score_expr = score_expr + case(
        [(func.lower(Product.category) == category_val, 20)],
        else_=0
    )
    for w in title_words:
        score_expr = score_expr + case(
            [(Product.title.ilike(f"%{w}%"), 1)],
            else_=0
        )

    q = (
        db.query(Product, score_expr.label("score"))
        .filter(Product.active == True)
        .filter(Product.id != product.id)
    )
    q = q.order_by(desc("score"), Product.updated_at.desc()).limit(limit)

    results = q.all()  # returns list of (Product, score)

    items = []
    for candidate, score in results:
        first_image_url = (
            candidate.images[0].url
            if candidate.images
            else "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
        )

        # convert any Decimal to float for JSON serialization
        actual_price = float(candidate.actual_price) if isinstance(candidate.actual_price, Decimal) else candidate.actual_price
        price = float(candidate.price) if isinstance(candidate.price, Decimal) else candidate.price

        items.append({
            "id": candidate.id,
            "title": candidate.title,
            "code": candidate.code,
            "actual_price": actual_price,
            "price": price,
            "image": first_image_url,
            "stock": candidate.stock,
            "category": candidate.category,
            "collection": candidate.collection,
        })

    return items



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





def get_list_of_product(
    db: Session,
    page: int,
    size: int,
    filter: str,
    search: str,
    category: str,
    is_admin: bool = False
):
    skip = (page - 1) * size
    query = db.query(Product)

    # --- Category filter ---
    if category:
        query = query.filter(func.lower(Product.category) == category.lower())

    # --- Only active for non-admins ---
    if not is_admin:
        query = query.filter(Product.active == True)

    # --- Search filter ---
    if search:
        query = query.filter(
            or_(
                Product.title.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.code.ilike(f"%{search}%"),
            )
        )

    # --- Sorting / special filters ---
    if not filter:
        query = query.order_by(Product.updated_at.desc())
    elif filter == "featured":
        query = query.filter(Product.featured == True)
    elif filter == "new_arrivals":
        query = query.filter(Product.created_at >= datetime.now() - timedelta(days=30))
    elif filter == "lowest_first":
        query = query.order_by(Product.price.asc())
    elif filter == "highest_first":
        query = query.order_by(Product.price.desc())
    elif filter in ("everyday_elegance", "occasion_charm", "the_bridal_edit", "designer_choice"):
        collection_slug = filter  
        collection_name = filter.replace("_", " ")  
        query = query.filter(
            or_(
                func.lower(Product.collection) == collection_slug.lower(),
                func.lower(Product.collection) == collection_name.lower(),
                Product.collection.ilike(f"%{collection_name}%"),
                Product.collection.ilike(f"%{collection_slug}%"),
            )
        )

    # --- Pagination ---
    total = query.count()
    products = query.offset(skip).limit(size).all()
    has_next = skip + size < total
    has_prev = page > 1
    items = []
    # --- User vs Admin response ---
    if not is_admin:
        for product in products:
            first_image_url = (
                product.images[0].url
                if product.images
                else "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
            )
            items.append(
                ProductListResponse(
                    id=product.id,
                    title=product.title,
                    code=product.code,
                    actual_price=product.actual_price,
                    price=product.price,
                    image=first_image_url,
                    stock=product.stock,
                    category=product.category,
                    collection=product.collection
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
