# Backend API — FastAPI Specification

## Overview

Python FastAPI backend serving:
1. Order creation and management
2. Async Google Sheets sync
3. Server-side CAPI (Conversions API) for Facebook, TikTok, Snapchat
4. Admin dashboard API (protected with JWT)
5. Tracking event storage

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, startup, CORS
│   ├── config.py            # Pydantic Settings from env
│   ├── database.py          # SQLAlchemy async engine + session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── order.py         # Order + OrderItem ORM models
│   │   └── tracking.py      # TrackingEvent ORM model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── order.py         # Pydantic schemas for orders
│   │   └── tracking.py      # Pydantic schemas for events
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── orders.py        # /api/orders routes
│   │   ├── tracking.py      # /api/track routes
│   │   └── admin.py         # /api/admin routes (JWT protected)
│   └── services/
│       ├── __init__.py
│       ├── sheets.py        # Google Sheets webhook sender
│       ├── capi.py          # Facebook/TikTok/Snap CAPI
│       └── admin_auth.py    # JWT auth helpers
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 0001_initial.py
├── alembic.ini
├── requirements.txt
├── Dockerfile
├── .env.example
└── .dockerignore
```

---

## main.py

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import orders, tracking, admin
import subprocess

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations on startup
    subprocess.run(["alembic", "upgrade", "head"], check=True)
    yield

app = FastAPI(
    title="RELAXIA API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)

app.include_router(orders.router, prefix="/api")
app.include_router(tracking.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin")

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "relaxia-api"}
```

---

## config.py

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ADMIN_USERNAME: str
    ADMIN_PASSWORD_HASH: str  # bcrypt hash
    
    GOOGLE_SHEETS_WEBHOOK_URL: str
    
    # Facebook CAPI
    FACEBOOK_ACCESS_TOKEN: str = ""
    FACEBOOK_PIXEL_ID: str = ""
    FACEBOOK_TEST_EVENT_CODE: str = ""  # for testing
    
    # TikTok CAPI
    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""
    
    # Snapchat CAPI
    SNAPCHAT_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""
    
    CORS_ORIGINS: List[str] = ["https://relaxia.store", "https://www.relaxia.store"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## database.py

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

class Base(DeclarativeBase):
    pass

engine = create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=False,
)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

---

## models/order.py

```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Decimal, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True)
    order_id = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    customer_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    city = Column(String(100), nullable=False)
    country = Column(String(50), default="Morocco")
    
    status = Column(String(50), default="pending_upsell")
    total_price = Column(Decimal(10, 2), nullable=False)
    currency = Column(String(10), default="MAD")
    
    # Tracking
    ip_address = Column(String(50))
    user_agent = Column(Text)
    fbclid = Column(String(255))
    ttclid = Column(String(255))
    source = Column(String(100))      # utm_source
    medium = Column(String(100))      # utm_medium
    campaign = Column(String(100))    # utm_campaign
    fbp = Column(String(255))         # Facebook _fbp cookie
    fbc = Column(String(255))         # Facebook _fbc cookie
    
    # Sheet sync
    sheet_synced = Column(Boolean, default=False)
    sheet_synced_at = Column(DateTime)
    sheet_error = Column(Text)
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    
    product_id = Column(String(50), nullable=False)    # 'coloflora', 'pylorex', 'flexima'
    product_name = Column(String(255), nullable=False)  # Arabic name
    product_name_fr = Column(String(255))               # French name
    sku = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)           # number of bundles
    offer_type = Column(String(20))                     # 'one', 'two', 'three'
    pieces_per_bundle = Column(Integer)                 # 1, 2, or 3
    unit_price = Column(Decimal(10, 2), nullable=False) # bundle price
    is_upsell = Column(Boolean, default=False)
    
    order = relationship("Order", back_populates="items")
```

---

## schemas/order.py

```python
from pydantic import BaseModel, field_validator
from typing import List, Optional
from decimal import Decimal
import re

class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    sku: str
    quantity: int
    offer_type: str       # 'one' | 'two' | 'three'
    pieces_per_bundle: int
    unit_price: Decimal
    is_upsell: bool = False

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    city: str
    items: List[OrderItemCreate]
    total_price: Decimal
    
    # Tracking (optional, from frontend)
    fbclid: Optional[str] = None
    ttclid: Optional[str] = None
    source: Optional[str] = None
    medium: Optional[str] = None
    campaign: Optional[str] = None
    fbp: Optional[str] = None
    fbc: Optional[str] = None
    
    @field_validator('phone')
    @classmethod
    def validate_moroccan_phone(cls, v: str) -> str:
        v = v.strip().replace(' ', '').replace('-', '')
        if not re.match(r'^0[5-7]\d{8}$', v):
            raise ValueError('رقم هاتف مغربي غير صحيح')
        return v
    
    @field_validator('customer_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError('الاسم يجب أن يكون حرفين على الأقل')
        return v

class UpsellAdd(BaseModel):
    product_id: str
    product_name: str
    sku: str
    quantity: int = 1
    offer_type: str = 'one'
    pieces_per_bundle: int = 1
    unit_price: Decimal = Decimal('229.00')

class OrderResponse(BaseModel):
    order_id: str
    status: str
    total_price: Decimal
    created_at: str
    
    class Config:
        from_attributes = True
```

---

## routers/orders.py

```python
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.order import OrderCreate, UpsellAdd, OrderResponse
from app.models.order import Order, OrderItem
from app.services.sheets import send_to_sheets
from app.services.capi import send_purchase_capi
import random, string
from datetime import datetime

router = APIRouter()

def generate_order_id() -> str:
    date_str = datetime.now().strftime('%Y%m%d')
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"RLX-{date_str}-{random_part}"

@router.post("/orders", response_model=OrderResponse, status_code=201)
async def create_order(
    order_data: OrderCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    order_id = generate_order_id()
    
    order = Order(
        order_id=order_id,
        customer_name=order_data.customer_name,
        phone=order_data.phone,
        city=order_data.city,
        total_price=order_data.total_price,
        status="pending_upsell",
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent"),
        fbclid=order_data.fbclid,
        ttclid=order_data.ttclid,
        source=order_data.source,
        medium=order_data.medium,
        campaign=order_data.campaign,
        fbp=order_data.fbp,
        fbc=order_data.fbc,
    )
    
    for item_data in order_data.items:
        item = OrderItem(**item_data.model_dump())
        order.items.append(item)
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    return OrderResponse(
        order_id=order.order_id,
        status=order.status,
        total_price=order.total_price,
        created_at=order.created_at.isoformat(),
    )

@router.post("/orders/{order_id}/upsell")
async def add_upsell(
    order_id: str,
    upsell_data: UpsellAdd,
    db: AsyncSession = Depends(get_db),
):
    order = await db.execute(
        select(Order).where(Order.order_id == order_id)
    )
    order = order.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    upsell_item = OrderItem(
        order_id=order.id,
        is_upsell=True,
        **upsell_data.model_dump()
    )
    order.total_price += upsell_data.unit_price
    db.add(upsell_item)
    await db.commit()
    
    return {"status": "upsell_added"}

@router.post("/orders/{order_id}/finalize")
async def finalize_order(
    order_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    order = await get_order_with_items(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = "confirmed"
    await db.commit()
    
    # Async: send to Google Sheets (non-blocking)
    background_tasks.add_task(send_to_sheets, order_id)
    
    # Async: send Purchase CAPI event
    background_tasks.add_task(send_purchase_capi, order)
    
    return {"status": "confirmed"}

@router.get("/orders/{order_id}")
async def get_order(order_id: str, db: AsyncSession = Depends(get_db)):
    order = await get_order_with_items(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
```

---

## services/sheets.py

```python
import httpx
from app.config import settings
from app.database import AsyncSessionLocal
from app.models.order import Order, OrderItem
from sqlalchemy import select
from datetime import datetime
import asyncio

async def send_to_sheets(order_id: str, retry_count: int = 0):
    """Send finalized order to Google Sheets via Apps Script webhook."""
    
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Order).where(Order.order_id == order_id)
        )
        order = result.scalar_one_or_none()
        if not order:
            return
        
        # Build payload matching sheet columns
        products_ar = "/".join([item.product_name for item in order.items])
        skus = "/".join([item.sku for item in order.items])
        quantities = "/".join([str(item.quantity * item.pieces_per_bundle) for item in order.items])
        
        payload = {
            "orderId": order.order_id,
            "date": order.created_at.strftime("%d/%m/%Y"),
            "country": "Morocco",
            "name": order.customer_name,
            "phone": order.phone,
            "city": order.city,
            "product": products_ar,
            "sku": skus,
            "quantity": quantities,
            "totalPrice": float(order.total_price),
            "currency": "MAD",
            "status": "",
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    settings.GOOGLE_SHEETS_WEBHOOK_URL,
                    json=payload,
                )
                response.raise_for_status()
            
            # Mark as synced
            order.sheet_synced = True
            order.sheet_synced_at = datetime.utcnow()
            await db.commit()
            
        except Exception as e:
            order.sheet_error = str(e)
            await db.commit()
            
            # Retry up to 3 times with exponential backoff
            if retry_count < 3:
                await asyncio.sleep(2 ** retry_count)
                await send_to_sheets(order_id, retry_count + 1)
```

---

## routers/admin.py

```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.admin_auth import verify_token, create_token
from app.config import settings
from passlib.context import CryptContext
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"])

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not verify_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid token")
    return True

@router.post("/login")
async def admin_login(username: str, password: str):
    if username != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/metrics", dependencies=[Depends(get_current_admin)])
async def get_metrics(
    start_date: str = None,
    end_date: str = None,
    db: AsyncSession = Depends(get_db),
):
    # Default: last 30 days
    end = datetime.utcnow()
    start = end - timedelta(days=30)
    
    if start_date:
        start = datetime.fromisoformat(start_date)
    if end_date:
        end = datetime.fromisoformat(end_date)
    
    # Total orders in period
    total_orders = await db.scalar(
        select(func.count(Order.id))
        .where(and_(Order.created_at >= start, Order.created_at <= end))
    )
    
    # Total revenue
    total_revenue = await db.scalar(
        select(func.sum(Order.total_price))
        .where(and_(
            Order.created_at >= start, 
            Order.created_at <= end,
            Order.status.not_in(['cancelled', 'returned'])
        ))
    )
    
    # Orders by status
    status_counts = await db.execute(
        select(Order.status, func.count(Order.id))
        .where(and_(Order.created_at >= start, Order.created_at <= end))
        .group_by(Order.status)
    )
    
    # Tracking events (page views for conversion rate)
    page_views = await db.scalar(
        select(func.count(TrackingEvent.id))
        .where(and_(
            TrackingEvent.created_at >= start,
            TrackingEvent.created_at <= end,
            TrackingEvent.event_type == 'PageView'
        ))
    )
    
    conversion_rate = (total_orders / page_views * 100) if page_views else 0
    avg_order_value = (total_revenue / total_orders) if total_orders else 0
    
    return {
        "period": {"start": start.isoformat(), "end": end.isoformat()},
        "total_orders": total_orders,
        "total_revenue": float(total_revenue or 0),
        "avg_order_value": float(avg_order_value),
        "conversion_rate": round(conversion_rate, 2),
        "page_views": page_views,
        "orders_by_status": dict(status_counts.fetchall()),
    }

@router.get("/orders", dependencies=[Depends(get_current_admin)])
async def list_orders(
    page: int = 1,
    limit: int = 20,
    status: str = None,
    search: str = None,
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * limit
    query = select(Order).offset(offset).limit(limit).order_by(Order.created_at.desc())
    
    if status:
        query = query.where(Order.status == status)
    if search:
        query = query.where(
            Order.customer_name.ilike(f"%{search}%") |
            Order.phone.ilike(f"%{search}%") |
            Order.order_id.ilike(f"%{search}%")
        )
    
    result = await db.execute(query)
    orders = result.scalars().all()
    
    total = await db.scalar(select(func.count(Order.id)))
    
    return {
        "orders": [serialize_order(o) for o in orders],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }

@router.patch("/orders/{order_id}/status", dependencies=[Depends(get_current_admin)])
async def update_order_status(
    order_id: str,
    status: str,
    db: AsyncSession = Depends(get_db),
):
    valid_statuses = ['pending_upsell', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    order = await get_order_by_id(db, order_id)
    order.status = status
    await db.commit()
    return {"status": status}
```

---

## requirements.txt

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy[asyncio]==2.0.35
asyncpg==0.29.0
alembic==1.13.3
pydantic==2.9.2
pydantic-settings==2.5.2
httpx==0.27.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
```

---

## Migration: 0001_initial.py (Alembic)

```python
"""Initial migration — create orders, order_items, tracking_events tables"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('orders',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('order_id', sa.String(20), unique=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('country', sa.String(50), server_default='Morocco'),
        sa.Column('status', sa.String(50), server_default='pending_upsell'),
        sa.Column('total_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('currency', sa.String(10), server_default='MAD'),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.Text()),
        sa.Column('fbclid', sa.String(255)),
        sa.Column('ttclid', sa.String(255)),
        sa.Column('source', sa.String(100)),
        sa.Column('medium', sa.String(100)),
        sa.Column('campaign', sa.String(100)),
        sa.Column('fbp', sa.String(255)),
        sa.Column('fbc', sa.String(255)),
        sa.Column('sheet_synced', sa.Boolean(), server_default='false'),
        sa.Column('sheet_synced_at', sa.DateTime()),
        sa.Column('sheet_error', sa.Text()),
    )
    
    op.create_table('order_items',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('order_id', sa.Integer(), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(50), nullable=False),
        sa.Column('product_name', sa.String(255), nullable=False),
        sa.Column('product_name_fr', sa.String(255)),
        sa.Column('sku', sa.String(50), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('offer_type', sa.String(20)),
        sa.Column('pieces_per_bundle', sa.Integer()),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_upsell', sa.Boolean(), server_default='false'),
    )
    
    op.create_table('tracking_events',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('order_id', sa.String(20)),
        sa.Column('product_id', sa.String(50)),
        sa.Column('value', sa.Numeric(10, 2)),
        sa.Column('currency', sa.String(10), server_default='MAD'),
        sa.Column('fbp', sa.String(255)),
        sa.Column('fbc', sa.String(255)),
        sa.Column('ttclid', sa.String(255)),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.Text()),
        sa.Column('event_id', sa.String(100), unique=True),
    )
    
    # Indexes
    op.create_index('ix_orders_order_id', 'orders', ['order_id'])
    op.create_index('ix_orders_created_at', 'orders', ['created_at'])
    op.create_index('ix_orders_status', 'orders', ['status'])
    op.create_index('ix_tracking_event_type', 'tracking_events', ['event_type'])

def downgrade():
    op.drop_table('tracking_events')
    op.drop_table('order_items')
    op.drop_table('orders')
```
