from pydantic import BaseModel, field_validator
from typing import List, Optional
from decimal import Decimal
import re


class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    sku: str
    quantity: int
    offer_type: str
    pieces_per_bundle: int = 1
    unit_price: Decimal
    is_upsell: bool = False


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    city: str
    items: List[OrderItemCreate]
    total_price: Decimal
    fbclid: Optional[str] = None
    ttclid: Optional[str] = None
    source: Optional[str] = None
    medium: Optional[str] = None
    campaign: Optional[str] = None
    fbp: Optional[str] = None
    fbc: Optional[str] = None
    event_id: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "").replace("-", "")
        if not re.match(r"^0[5-7]\d{8}$", v):
            raise ValueError("رقم هاتف مغربي غير صحيح")
        return v

    @field_validator("customer_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("الاسم يجب أن يكون حرفين على الأقل")
        return v


class UpsellAdd(BaseModel):
    product_id: str
    product_name: str
    sku: str
    quantity: int = 1
    offer_type: str = "one"
    pieces_per_bundle: int = 1
    unit_price: Decimal = Decimal("229.00")


class OrderResponse(BaseModel):
    order_id: str
    status: str
    total_price: float
    created_at: str
    customer_name: str
    phone: str
    city: str
    items: list = []

    class Config:
        from_attributes = True
