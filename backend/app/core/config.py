from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI App"
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_DAYS:int = 30
    SECRET_KEY:str
    ALGORITHM: str = "HS256"
    GOOGLE_CLIENT_ID:str
    RESEND_FROM_ADDRESS:str
    RESEND_API_KEY : str
    POSTGRES_USER:str
    PRODUCTION:str
    POSTGRES_DB : str
    POSTGRES_PASSWORD :str
    BASE_URL:str = "http:localhost:8000"
    MEDIA_FOLDER:str = "media"
    RAZORPAY_KEY_ID:str
    RAZORPAY_SECRET:str
    class Config:
        env_file = ".env"

settings = Settings()
