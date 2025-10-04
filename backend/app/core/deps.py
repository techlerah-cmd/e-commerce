from fastapi.security import OAuth2PasswordBearer
from app.core.database import SessionLocal
from fastapi import Depends,HTTPException,status,Response
from app.core.security import create_access_token,decode_token
from sqlalchemy.orm import Session
from app.app_users.crud import get_user_by_email
from app.app_users.models import User
# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(token:str=Depends(oauth2_scheme),db:Session= Depends(get_db)):
    email = decode_token(token)
    if email is None:
        raise HTTPException(detail="Invalid Token",status_code=401)
    print(email)
    user = get_user_by_email(db,email)
    if not user:
        raise HTTPException(status_code=401,detail="User not found")
    return user

def is_admin(user:User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(detail="You don't have access to this action",status_code=403)
    return user