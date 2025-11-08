# schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Any
from uuid import UUID

class ProductImageBase(BaseModel):
    id: UUID
    product_id: Optional[UUID] = None
    path: Optional[str] = None
    alt: Optional[str] = None
    url: str

    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    id: UUID
    title: str
    code: str
    description: str
    active: bool
    price: float
    category: str
    actual_price: float
    created_at: datetime
    stock: int
    # metadata can be arbitrary dict or list
    product_metadata: Optional[Any] = None
    images: List[ProductImageBase] = []
    featured: bool = False
    collection: Optional[str] = None

    class Config:
        orm_mode = True


class ProductListResponse(BaseModel):
    id: UUID
    title: str
    code: str
    category: str
    actual_price: float
    price: float
    image: str
    stock: int
    collection: Optional[str] = None

    class Config:
        orm_mode = True


class ProductResponse(ProductBase):
    review_count: Optional[int] = None
    avg_rating: Optional[float] = None
    # related products should be a list of summary objects (or None)
    related_products: Optional[List[ProductListResponse]] = None

    class Config:
        orm_mode = True


class ProductAdminListResponse(ProductBase):
    total_sold: Optional[int] = None

    class Config:
        orm_mode = True
