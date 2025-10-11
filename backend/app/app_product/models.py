import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, Numeric, Integer, ForeignKey,DECIMAL,JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.common.mixin import IDMixin,CreatedUpdatedAtMixin
from app.core.config import settings
from sqlalchemy.dialects.postgresql import JSONB




class Product(Base, IDMixin, CreatedUpdatedAtMixin):
    __tablename__ = "products"

    title = Column(String(255), nullable=False, index=True)
    stock = Column(Integer, default=1)
    code = Column(String(100))
    price = Column(DECIMAL(10,5))
    actual_price = Column(DECIMAL(10,5))
    description = Column(Text)
    active = Column(Boolean, default=True)
    product_metadata = Column(JSONB,nullable=True,default=[])
    featured = Column(Boolean, default=False)
    category = Column(String,nullable=True)
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    path = Column(String(500), nullable=False)  # store only relative path
    alt = Column(String(255),default="Product Image")
    product = relationship("Product", back_populates="images",uselist=False)
    @property
    def url(self) -> str:
        return f"{settings.BASE_URL}/{self.path}"

