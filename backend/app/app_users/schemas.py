from pydantic import BaseModel, EmailStr
# from app_subscription.schemas import SubscriptionResponse
# from app_dog.schemas import DogResponse

from typing import Optional
from enum import Enum
from uuid import UUID
class AuthProvider(str, Enum):
    local = "local"
    google = "google"

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    auth_provider: AuthProvider


class GoogleLoginRequest(BaseModel):
  token : str

class LoginRequest(BaseModel):
  email : str
  password : str

class UserResponse(BaseModel):
  id : UUID
  email : str
  is_admin : bool

class LoginResponse(BaseModel):
  token : str
  user : UserResponse

class ForgotPassword(BaseModel):
  email: str | None = None
  

class ForgotPasswordResponse(BaseModel):
  token : str

class ForgotPasswordOTPVerify(BaseModel):
  ref : str
  otp :str

class ForgotPasswordPasswordReset(BaseModel):
  token : str
  password :str


class AddressBase(BaseModel):
  id:UUID
  full_name:str
  phone : str
  street:str
  city:str
  state:str
  country:str
  postcode:str
  landmark:str

class AddressCreate(BaseModel):  # Don't inherit from AddressBase
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    country: str
    postcode: str
    landmark: str

class AddressResponse(AddressBase):
  pass

class ContactUs(BaseModel):
  first_name : str
  last_name : str
  email : str
  phone : str
  subject : str
  message : str