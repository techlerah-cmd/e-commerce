# app/carts/schemas.py
from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import datetime


# Coupon Code

class CouponBase(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    max_uses: Optional[int] = None
    expires_at: Optional[datetime] = None
    min_order : float
    class Config:
        orm_mode = True
        from_attributes = True

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    max_uses: Optional[int] = None
    expires_at: Optional[datetime] = None
    min_order : Optional[float] = None

class CouponResponse(CouponBase):
    id: UUID
    used_count: int

    class Config:
        orm_mode = True

class CouponApply(BaseModel):
    code : str
class CartItemCreate(BaseModel):
    product_id: UUID
    qty: int

class CartItemUpdate(BaseModel):
    qty: int

class CartProductResponse(BaseModel):
    price : float
    title : str | None
    stock : int

class CartItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    qty: int
    price: float
    image : str | None
    title : str | None
    product : CartProductResponse 
    class Config:
        orm_mode = True


class CartOut(BaseModel):
    id: UUID
    items: List[CartItemResponse] = []
    coupon : CouponResponse | None = None
    class Config:
        orm_mode = True


