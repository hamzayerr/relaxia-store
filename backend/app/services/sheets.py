import httpx
import asyncio
from datetime import datetime
from app.config import settings
from app.database import AsyncSessionLocal
from app.models.order import Order
from sqlalchemy import select
from sqlalchemy.orm import selectinload


async def send_to_sheets(order_id: str, retry_count: int = 0) -> None:
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        return

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Order).where(Order.order_id == order_id).options(selectinload(Order.items))
        )
        order = result.scalar_one_or_none()
        if not order:
            return

        products_ar = "/".join(item.product_name for item in order.items)
        skus = "/".join(item.sku for item in order.items)
        quantities = "/".join(str(item.quantity * item.pieces_per_bundle) for item in order.items)

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
                response = await client.post(settings.GOOGLE_SHEETS_WEBHOOK_URL, json=payload)
                response.raise_for_status()

            order.sheet_synced = True
            order.sheet_synced_at = datetime.utcnow()
            await db.commit()

        except Exception as exc:
            order.sheet_error = str(exc)
            await db.commit()

            if retry_count < 3:
                await asyncio.sleep(2 ** retry_count)
                await send_to_sheets(order_id, retry_count + 1)
