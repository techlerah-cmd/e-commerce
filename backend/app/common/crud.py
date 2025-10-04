
from app.common.schemas import PaginationResponse
def to_paginate(query,schema,page=1,size=10):
  total = query.count()
  skip = (page - 1) * size
  items = query.offset(skip).limit(size).all()
  has_next = skip + size  < total
  has_prev = page > 1
  return PaginationResponse[schema](
        items=items,
        page=page,
        size=size,
        has_next=has_next,
        has_prev=has_prev,
        total=total
    )
