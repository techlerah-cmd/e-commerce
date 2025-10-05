from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.database import Base, engine
from app.api.v1 import routes_users,routes_cart,routes_order,routes_product
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lerah FastAPI Backend")

app.include_router(
  routes_users.app,
  prefix="/api/v1/user",
  tags=["user"],
)
app.include_router(
  routes_order.app,
  prefix="/api/v1/order",
  tags=["order"],
)
app.include_router(
  routes_product.app,
  prefix="/api/v1/product",
  tags=["product"],
)
app.include_router(
  routes_cart.router_cart,
  prefix="/api/v1/cart",
  tags=["cart"],
)
app.include_router(
  routes_cart.router_coupon,
  prefix="/api/v1/coupon",
  tags=["coupon"],
)
app.include_router(
  routes_cart.router_admin,
  prefix="/api/v1/admin",
  tags=["admin"],
)
if settings.PRODUCTION == 'false':
  app.mount("/media", StaticFiles(directory="media"), name="media")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"], 
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)