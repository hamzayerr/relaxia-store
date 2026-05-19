from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
from passlib.context import CryptContext

from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.tracking import TrackingEvent
from app.services.admin_auth import create_token, verify_token
from app.config import settings

router = APIRouter()
security = HTTPBearer()
pwd_ctx = CryptContext(schemes=["bcrypt"])


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not verify_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid token")
    return True


@router.post("/login")
async def admin_login(username: str, password: str):
    if username != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_ctx.verify(password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/metrics", dependencies=[Depends(get_current_admin)])
async def get_metrics(
    start_date: str = None,
    end_date: str = None,
    db: AsyncSession = Depends(get_db),
):
    end = datetime.utcnow()
    start = end - timedelta(days=30)
    if start_date:
        start = datetime.fromisoformat(start_date)
    if end_date:
        end = datetime.fromisoformat(end_date)

    total_orders = await db.scalar(
        select(func.count(Order.id)).where(and_(Order.created_at >= start, Order.created_at <= end))
    )

    total_revenue = await db.scalar(
        select(func.sum(Order.total_price)).where(and_(
            Order.created_at >= start, Order.created_at <= end,
            Order.status.notin_(["cancelled", "returned"])
        ))
    )

    status_result = await db.execute(
        select(Order.status, func.count(Order.id))
        .where(and_(Order.created_at >= start, Order.created_at <= end))
        .group_by(Order.status)
    )

    page_views = await db.scalar(
        select(func.count(TrackingEvent.id)).where(and_(
            TrackingEvent.created_at >= start, TrackingEvent.created_at <= end,
            TrackingEvent.event_type == "PageView"
        ))
    ) or 0

    orders_by_status = dict(status_result.fetchall())
    avg_order_value = float(total_revenue or 0) / (total_orders or 1)
    conversion_rate = round((total_orders or 0) / max(page_views, 1) * 100, 2)

    return {
        "period": {"start": start.isoformat(), "end": end.isoformat()},
        "total_orders": total_orders or 0,
        "total_revenue": float(total_revenue or 0),
        "avg_order_value": round(avg_order_value, 2),
        "conversion_rate": conversion_rate,
        "page_views": page_views,
        "orders_by_status": orders_by_status,
    }


@router.get("/metrics/chart", dependencies=[Depends(get_current_admin)])
async def get_chart(
    start_date: str = None,
    end_date: str = None,
    db: AsyncSession = Depends(get_db),
):
    end = datetime.utcnow()
    start = end - timedelta(days=30)
    if start_date:
        start = datetime.fromisoformat(start_date)
    if end_date:
        end = datetime.fromisoformat(end_date)

    orders_result = await db.execute(
        select(Order).where(and_(Order.created_at >= start, Order.created_at <= end))
        .options(selectinload(Order.items))
    )
    orders = orders_result.scalars().all()

    daily: dict = {}
    by_product: dict = {}

    for order in orders:
        day = order.created_at.strftime("%Y-%m-%d")
        if day not in daily:
            daily[day] = {"date": day, "orders": 0, "revenue": 0.0}
        daily[day]["orders"] += 1
        daily[day]["revenue"] += float(order.total_price)

        for item in order.items:
            if item.product_id not in by_product:
                by_product[item.product_id] = {"product_id": item.product_id, "product_name": item.product_name, "orders": 0, "revenue": 0.0}
            by_product[item.product_id]["orders"] += 1
            by_product[item.product_id]["revenue"] += float(item.unit_price)

    return {
        "daily": sorted(daily.values(), key=lambda x: x["date"]),
        "by_product": list(by_product.values()),
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
    query = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc()).offset(offset).limit(limit)
    count_query = select(func.count(Order.id))

    if status:
        query = query.where(Order.status == status)
        count_query = count_query.where(Order.status == status)

    if search:
        like = f"%{search}%"
        cond = Order.customer_name.ilike(like) | Order.phone.ilike(like) | Order.order_id.ilike(like)
        query = query.where(cond)
        count_query = count_query.where(cond)

    result = await db.execute(query)
    orders = result.scalars().all()
    total = await db.scalar(count_query)

    def serialize(o: Order):
        return {
            "order_id": o.order_id,
            "created_at": o.created_at.isoformat(),
            "customer_name": o.customer_name,
            "phone": o.phone,
            "city": o.city,
            "status": o.status,
            "total_price": float(o.total_price),
            "sheet_synced": o.sheet_synced,
            "source": o.source,
            "medium": o.medium,
            "fbclid": o.fbclid,
            "ip_address": o.ip_address,
            "items": [
                {"product_name": i.product_name, "quantity": i.quantity, "unit_price": float(i.unit_price), "is_upsell": i.is_upsell}
                for i in o.items
            ],
        }

    return {"orders": [serialize(o) for o in orders], "total": total or 0, "page": page}


@router.patch("/orders/{order_id}/status", dependencies=[Depends(get_current_admin)])
async def update_status(order_id: str, status: str, db: AsyncSession = Depends(get_db)):
    valid = ["pending_upsell", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"]
    if status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")

    result = await db.execute(select(Order).where(Order.order_id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    await db.commit()
    return {"status": status}
