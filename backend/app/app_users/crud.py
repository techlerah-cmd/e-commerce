from app.app_users.models import User,Address
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.app_users.schemas import *
pwd_context = CryptContext(schemes=['bcrypt'],deprecated='auto')


def get_user_by_email(db:Session,email):
    return db.query(User).filter(User.email == email).first()


def verify_password(plain_password,hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def create_user(db:Session,email,password=None):
    if password:
        password = pwd_context.hash(password)
    new_user = User(
        email=email,
        password = password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
def update_user_data(db:Session,user,update_data:dict):
    for key,value in update_data.items():
        setattr(user,key,value)
    db.commit()
    db.refresh(user)
    return user
def update_user_password(db:Session,user,password):
    hashed_password = pwd_context.hash(password)
    user.password = hashed_password
    db.commit()
    db.refresh(user)
    return user





def update_forgot_password(db: Session, db_forgot, update_data: dict):
    for key, value in update_data.items():
        setattr(db_forgot, key, value)
    db.commit()
    db.refresh(db_forgot)
    return db_forgot


def create_address(db:Session,data:AddressCreate,user:User):
    db_address = Address(**(data.dict()))
    db_address.user_id = user.id

    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

def update_address(db:Session,update_data:AddressCreate,db_address):
    for key,value in update_data.dict().items():
        setattr(db_address,key,value)
    db.commit()
    db.refresh(db_address)
    return db_address