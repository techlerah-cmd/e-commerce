from fastapi import FastAPI,Depends,Request,Response

from fastapi.staticfiles import StaticFiles

from app.core.database import Base, engine
from app.api.v1 import routes_users,routes_cart,routes_order,routes_product
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from redis.asyncio import from_url as redis_from_url
import traceback
# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lerah FastAPI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:8000",
        "http://localhost:8080",  # if your frontend runs on port 3000
        "https://lerah.in"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Use redis.asyncio client
    redis_url = settings.REDIS_URL if settings.PRODUCTION == 'true' else "redis://localhost:6379/0"
    redis = redis_from_url(redis_url, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis)


rate_limiter = RateLimiter(times=10, seconds=60)

@app.middleware("http")
async def global_rate_limit(request: Request, call_next):
    limiter_response = Response()
    try:
        await rate_limiter(request, limiter_response)
    except Exception as e:
        return Response(
            status_code=429,
            content={"detail": f"Too many request, please try again later"},
            media_type="application/json",
        )
    try:
        # Proceed with request if not limited
        response = await call_next(request)
    except Exception as e:
        traceback.print_exc()
        return Response(status_code=500, content={"detail": str(e)}, media_type="application/json",)

    # Copy limiter headers (optional, for rate-limit info)
    for k, v in limiter_response.headers.items():
        if k not in response.headers:
            response.headers[k] = v

    return response



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