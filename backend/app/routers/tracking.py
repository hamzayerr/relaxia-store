from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.tracking import TrackingEvent
import uuid

router = APIRouter()


@router.post("/track/event")
async def track_event(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    body = await request.json()
    event = TrackingEvent(
        event_type=body.get("event_type", "PageView"),
        order_id=body.get("order_id"),
        product_id=body.get("product_id"),
        value=body.get("value"),
        currency=body.get("currency", "MAD"),
        fbp=body.get("fbp"),
        fbc=body.get("fbc"),
        ttclid=body.get("ttclid"),
        ip_address=body.get("ip_address") or (request.client.host if request.client else None),
        user_agent=request.headers.get("user-agent"),
        event_id=body.get("event_id") or str(uuid.uuid4()),
    )
    db.add(event)
    await db.commit()
    return {"ok": True}
