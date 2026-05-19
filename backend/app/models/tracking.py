from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text
from datetime import datetime
from app.database import Base


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    order_id = Column(String(20))
    product_id = Column(String(50))
    value = Column(Numeric(10, 2))
    currency = Column(String(10), default="MAD")
    fbp = Column(String(255))
    fbc = Column(String(255))
    ttclid = Column(String(255))
    ip_address = Column(String(50))
    user_agent = Column(Text)
    event_id = Column(String(100), unique=True)
