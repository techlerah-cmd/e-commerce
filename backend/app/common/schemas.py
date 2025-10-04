from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")

class PaginationResponse(BaseModel, Generic[T]):
    items: List[T]
    page: int
    size: int
    has_next: bool
    has_prev: bool
    total: int