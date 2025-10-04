from fastapi import APIRouter,Form,Depends,File,UploadFile,HTTPException,Query
from app.app_product.schemas import *
from app.app_users.schemas import *
from app.core.deps import is_admin,get_db,get_current_user
from app.core.security import create_access_token
from sqlalchemy.orm import Session
import app.app_product.crud as crud_product 
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings
from app.common.utils import generate_otp
from app.lib.resend import send_otp_email
from app.app_users.models import User
from typing import List
from app.common.schemas import PaginationResponse
app  = APIRouter()
import json


@app.get("/show/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
):
    # fetch product
    db_product = crud_product.get_product_by_id(db, product_id,is_admin=True)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    return db_product

@app.post('/',response_model=ProductResponse)
def create_product(
      title:str=Form(...),
      description:str=Form(...),
      price:float = Form(...),
      actual_price:float = Form(...),
      code:str=Form(...),
      active:bool=Form(...),
      images: List[UploadFile] = File(None),
      db:Session=Depends(get_db),
      user:User=Depends(is_admin),
      product_metadata: str = Form("{}"),
      featured:bool=False,
      stock:int=Form(...)
      ):
  #  check any other product the same code
  try:
        product_metadata_obj = json.loads(product_metadata)
  except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid product_metadata JSON")
  db_product = crud_product.get_product_by_code(db,code)
  if db_product:
    raise HTTPException(detail="Product with this code already exist",status_code=400)
  
  # create product
  product_data = {
    "title":title,
    "description":description,
    "code":code,
    "active":active,
    "actual_price":actual_price,
    "price":price,
    "product_metadata":product_metadata_obj,
    "featured":featured,
    "stock":stock
  }
  db_product = crud_product.create_product(db,product_data)
  db.add(db_product)
  db.flush()
  product_id = db_product.id
  #  now let's create images
  print(len(images))
  db_images = []
  if images:
    
    for image in images:
      db_product_image = crud_product.upload_product_image(db,image,product_id)
      db_images.append(db_product_image)
  
  # now let's commit all
  try:
    db.add(db_product)
    for db_image in db_images:
      db.add(db_image)
    db.commit()
    db.refresh(db_product)
    for db_image in db_images:
      db.refresh(db_image)
  except:
      db.rollback()
      raise
  print(ProductResponse.from_orm(db_product))
  return db_product



@app.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    actual_price: float = Form(...),
    code: str = Form(...),
    active: bool = Form(...),
    stock: int = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    deleted_images_ids: Optional[List[str]] = Form(None),  # full id
    db: Session = Depends(get_db),
    user: User = Depends(is_admin),
    product_metadata: str = Form("{}"),  # receive as string
    featured: bool = Form(...),
):
    
    try:
        product_metadata_obj = json.loads(product_metadata)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid product_metadata JSON")

  # fetch existing product
    db_product = crud_product.get_product_by_id(db, product_id,is_admin=True)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = {
      "code":code,
      "title":title,
      "description":description,
      "price":price,
      "actual_price":actual_price,
      "active":active,
      "product_metadata":product_metadata_obj,
      "featured":featured,
      "stock":stock
    }
    db_product = crud_product.update_product(db,db_product,update_data)
    print(deleted_images_ids)
    # delete old images
    if deleted_images_ids:
        for image_id in deleted_images_ids:
            # remove from storage
            crud_product.delete_product_image(db,image_id)

    new_product_images = []
    # add new images
    if images:
        for image in images:
            db_product_image = crud_product.upload_product_image(db, image, product_id)
            new_product_images.append(db_product_image)
    # commit & refresh
    try:
      
      for db_image in new_product_images:
        db.add(db_image)
      db.commit()
      db.refresh(db_product)
      for db_image in new_product_images:
        db.refresh(db_image)
    except:
        db.rollback()
        raise
    return db_product
  
@app.delete("/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(is_admin),
):
    # fetch product
    db_product = crud_product.get_product_by_id(db, product_id,is_admin=True)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # fetch and delete images
    for image in db_product.images:
        crud_product.delete_product_image(db,image.id)  # delete from storage

    # delete product
    db.delete(db_product)
    db.commit()

    return {"detail": f"Product {product_id} deleted successfully"}



@app.get("/list",response_model=PaginationResponse[ProductListResponse])
def get_product_list(
    page:int = Query(1,ge=1),
    size:int = Query(10,ge=1),
    filter:str =Query(""),
    search: Optional[str] = Query(None, description="Search in title or description"),
    db:Session=Depends(get_db)
    ):
    print(size,page,search,filter)
    return crud_product.get_list_of_product(db,page,size,filter,search)


@app.get("/list/admin",response_model=PaginationResponse[ProductAdminListResponse])
def get_product_list(
    page:int = Query(1,ge=1),
    size:int = Query(10,ge=1),
    sort_by_price:str =Query("asc",regex="^(asc|desc)$"),
    search: Optional[str] = Query(None, description="Search in title or description"),
    db:Session=Depends(get_db),
    user:User=Depends(is_admin)
    ):
    return crud_product.get_list_of_product(db,page,size,sort_by_price,search,is_admin=True)