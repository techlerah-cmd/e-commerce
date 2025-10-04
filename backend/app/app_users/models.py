from sqlalchemy import Column, Integer, String,UUID,Boolean,Enum,ForeignKey,JSON

from app.core.database import Base
from app.common.mixin import CreatedUpdatedAtMixin,IDMixin
import uuid
import enum
from sqlalchemy.orm import relationship

class AuthProvider(str, enum.Enum):
    local = "local"
    google = "google"

class User(Base,CreatedUpdatedAtMixin,IDMixin):
  __tablename__ = "users"
  email = Column(String, unique=True, index=True, nullable=False)
  password = Column(String, nullable=True)  # for local login
  auth_provider = Column(Enum(AuthProvider), default=AuthProvider.local, nullable=False)
  google_id = Column(String, unique=True, nullable=True)
  full_name = Column(String, nullable=True)
  profile_picture = Column(String, nullable=True)
  is_admin = Column(Boolean,default=False)
  orders = relationship("Order", back_populates="user")
  cart = relationship("Cart", back_populates="user", uselist=False)
  address = relationship("Address",back_populates="user",uselist=False)

class ForgotPassword(Base):
  __tablename__ = "forgot_password"
  email = Column(String,unique=True,primary_key=True)
  ref = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
  otp = Column(String)
  verified = Column(Boolean,default=False)

class Address(Base,IDMixin):
    __tablename__ = "addresses"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    full_name = Column(String(200))
    phone = Column(String(30))
    street = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postcode = Column(String(20))
    landmark =  Column(String(1024))
    user = relationship("User", back_populates="address")