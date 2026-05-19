from sqlalchemy import Column, Integer, String, DateTime, Boolean, Numeric, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(20), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    city = Column(String(100), nullable=False)
    country = Column(String(50), default="Morocco")

    status = Column(String(50), default="pending_upsell", index=True)
    total_price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="MAD")

    ip_address = Column(String(50))
    user_agent = Column(Text)
    fbclid = Column(String(255))
    ttclid = Column(String(255))
    source = Column(String(100))
    medium = Column(String(100))
    campaign = Column(String(100))
    fbp = Column(String(255))
    fbc = Column(String(255))
    event_id = Column(String(100))

    sheet_synced = Column(Boolean, default=False)
    sheet_synced_at = Column(DateTime)
    sheet_error = Column(Text)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)

    product_id = Column(String(50), nullable=False)
    product_name = Column(String(255), nullable=False)
    sku = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    offer_type = Column(String(20))
    pieces_per_bundle = Column(Integer, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    is_upsell = Column(Boolean, default=False)

    order = relationship("Order", back_populates="items")
