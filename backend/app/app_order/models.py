# app/orders/models.py
import uuid, datetime
from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey,Integer
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from enum import Enum
from app.common.mixin import CreatedUpdatedAtMixin,IDMixin


class OrderStatus(str, Enum):
    PAYMENT_PENDING = "payment_pending"
    PAYMENT_PAID = "payment_paid"
    PAYMENT_FAILED= "payment_failed"
    SHIPPED = "shipped"
    CANCELLED = "cancelled"


class Order(Base,CreatedUpdatedAtMixin,IDMixin):
    __tablename__ = "orders"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    order_number = Column(String(64), unique=True, index=True, nullable=False, default=None)
    status = Column(String(50), default=OrderStatus.PAYMENT_PENDING.value, index=True)
    subtotal = Column(Numeric(12,2), nullable=False)
    tax = Column(Numeric(12,2), nullable=False, default=0)
    discount = Column(Numeric(12,2), nullable=False, default=0)
    total = Column(Numeric(12,2), nullable=False)
    delivery_partner = Column(String(255),nullable=True)
    delivery_tracking_id = Column(String(255),nullable=True)
    shipping_charge = Column(Numeric(12,2), nullable=False, default=0)
    shipping_address = Column(JSON, nullable=False)
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    transaction = relationship("OrderTransaction", back_populates="order", cascade="all, delete-orphan", uselist=False)
    user = relationship("User", back_populates="orders")

class OrderTransaction(Base, IDMixin, CreatedUpdatedAtMixin):
    __tablename__ = "order_transactions"
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    transaction_id = Column(String(128), unique=True, nullable=False)
    payment_method = Column(String(64), nullable=False)
    amount = Column(Numeric(12,2), nullable=False)
    status = Column(String(50), nullable=False)
    transaction_metadata = Column(JSON, nullable=True)
    order = relationship("Order", back_populates="transaction")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="SET NULL"), index=True, nullable=True)
    name = Column(String(255))
    qty = Column(Integer, nullable=False)
    unit_price = Column(Numeric(12,2), nullable=False)
    total_price = Column(Numeric(12,2), nullable=False)
    rating = Column(Integer, nullable=True)
    product = relationship("Product", back_populates="order_items")
    order = relationship("Order", back_populates="items")
    # 

