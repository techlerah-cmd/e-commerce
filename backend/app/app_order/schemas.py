# app/orders/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
class OrderAddressResponse(BaseModel):
    id: UUID
    order_id: UUID
    snapshot: dict
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class OrderTransactionResponse(BaseModel):
    id: UUID
    order_id: UUID
    transaction_id: str
    payment_method: str
    amount: float
    status: str
    transaction_metadata: Optional[dict] = None  # optional
    created_at: Optional[datetime] = None        # optional
    updated_at: Optional[datetime] = None        # optional
    class Config:
        orm_mode = True
        from_attributes = True


class UserOrderTransactionResponse(BaseModel):
    id: UUID
    order_id: UUID
    transaction_id: str
    payment_method: str
    amount: float
    status: str

    class Config:
        orm_mode = True
        from_attributes = True

class OrderItemIn(BaseModel):
    product_id: UUID
    qty: int

class OrderCreate(BaseModel):
    user_id: Optional[UUID]
    items: List[OrderItemIn]
    address: Optional[dict]
    coupon_code: Optional[str] = None


class OrderItemOut(BaseModel):
    id: UUID
    name: str
    qty: int
    product_id: UUID
    unit_price: float
    total_price: float
    class Config:
        orm_mode = True
        from_attributes = True


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    class Config:
        orm_mode = True
        from_attributes = True
class OrderUserResponse(BaseModel):
    id: UUID
    order_number: str
    status: str
    subtotal: float
    tax : float
    discount : float
    shipping_charge: float
    total: float
    items: List[OrderItemOut] = []
    shipping_address: Optional[dict] = {}
    transaction: Optional[UserOrderTransactionResponse] = None  
    delivery_partner : str | None =  None
    delivery_tracking_id: str | None = None
    created_at:datetime
    created_at: datetime
    updated_at: datetime
    user : UserResponse
    class Config:
        orm_mode = True
        from_attributes = True

class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    status: str
    subtotal: float
    tax : float
    discount : float
    shipping_charge: float
    total: float
    delivery_partner : str | None =  None
    delivery_tracking_id: str | None = None
    items: List[OrderItemOut] = []
    shipping_address: Optional[dict] = {}
    transaction: Optional[OrderTransactionResponse] = None
    created_at  : datetime
    updated_at  : datetime
    user : UserResponse
    class Config:
        orm_mode = True
        from_attributes = True

class TransactionUpdate(BaseModel):
    status: str

class OrderStatusUpdate(BaseModel):
    status: str
    delivery_tracking_id: str | None = None
    delivery_partner: str | None = None