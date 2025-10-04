import uuid, datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.common.mixin import IDMixin,CreatedUpdatedAtMixin


class Cart(Base,IDMixin,CreatedUpdatedAtMixin):
    __tablename__ = "carts"
    user_id = Column(UUID(as_uuid=True),ForeignKey('users.id',ondelete="CASCADE"),index=True)
    coupon_id = Column(UUID(as_uuid=True), ForeignKey("coupons.id", ondelete="SET NULL"), nullable=True, index=True)
    user = relationship("User", uselist=False,back_populates='cart')
    coupon = relationship("Coupon", uselist=False)
    items = relationship("CartItem", back_populates="cart")


class CartItem(Base,IDMixin,CreatedUpdatedAtMixin):
    __tablename__ = "cart_items"
    cart_id = Column(UUID(as_uuid=True),ForeignKey("carts.id",ondelete="CASCADE"),index=True)
    product_id = Column(UUID(as_uuid=True),ForeignKey('products.id',ondelete="CASCADE"),index=True)
    qty = Column(Integer,nullable=False,default=1)
    price = Column(Numeric(12,2),nullable=False)
    cart = relationship('Cart', back_populates="items", uselist=False)
    product = relationship('Product',back_populates="cart_items",uselist=False)
    @property
    def image(self) -> str | None:
        if self.product and self.product.images:
            return self.product.images[0].url   # return first image
        return "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
    @property
    def title(self) -> str | None:
        if self.product : return self.product.title
        return ""
class Coupon(Base, IDMixin, CreatedUpdatedAtMixin):
    __tablename__ = "coupons"

    code = Column(String(50), unique=True, index=True, nullable=False)  
    discount_type = Column(String(20), nullable=False, default="percent")  
    discount_value = Column(Numeric(12, 2), nullable=False)
    min_order = Column(Numeric(12,2),nullable=False)
    max_uses = Column(Integer, nullable=True)  
    used_count = Column(Integer, default=0, nullable=False)
    expires_at = Column(DateTime, nullable=True)