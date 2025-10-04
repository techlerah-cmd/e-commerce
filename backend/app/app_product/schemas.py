from pydantic import BaseModel
from datetime import datetime
from typing import List
from uuid import UUID

class ProductImageBase(BaseModel):
  id : UUID
  product_id : UUID
  path : str
  alt : str
  url : str
  class Config:
        orm_mode = True
        from_attributes = True

class ProductBase(BaseModel):
  id : UUID
  title :str
  code : str
  description :str
  active : bool
  price : float
  actual_price : float
  created_at : datetime
  stock:int
  product_metadata :dict | List
  images: List[ProductImageBase]
  featured:bool
  class Config:
        orm_mode = True
        from_attributes = True

class ProductResponse(ProductBase):
  review_count: int | None =  None
  avg_rating: float | None =  None
  class Config:
    orm_mode = True
    from_attributes=True

class ProductCreate(BaseModel):
  pass

class ProductListResponse(BaseModel):
  title: str
  code : str
  actual_price: float
  price: float
  image: str
  stock : int
  id : UUID
  class Config:
    orm_mode = True

class ProductAdminListResponse(ProductBase):
  title: str
  id:UUID
  code : str
  actual_price: float
  price: float
  stock : int 
  total_sold: int | None =None
  class Config:
    orm_mode = True
    from_attributes=True