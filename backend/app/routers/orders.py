import random
import string
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, UpsellAdd, OrderResponse
from app.services.sheets import send_to_sheets
from app.services.capi import send_purchase_capi

router = APIRouter()


def generate_order_id() -> str:
    date_str = datetime.now().strftime("%Y%m%d")
    random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"RLX-{date_str}-{random_part}"


async def get_order_with_items(db: AsyncSession, order_id: str) -> Order | None:
    result = await db.execute(
        select(Order).where(Order.order_id == order_id).options(selectinload(Order.items))
    )
    return result.scalar_one_or_none()


@router.post("/orders", status_code=201)
async def create_order(
    order_data: OrderCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    order = Order(
        order_id=generate_order_id(),
        customer_name=order_data.customer_name,
        phone=order_data.phone,
        city=order_data.city,
        total_price=order_data.total_price,
        status="pending_upsell",
        ip_address=request.headers.get("x-forwarded-for") or (request.client.host if request.client else None),
        user_agent=request.headers.get("user-agent"),
        fbclid=order_data.fbclid,
        ttclid=order_data.ttclid,
        source=order_data.source,
        medium=order_data.medium,
        campaign=order_data.campaign,
        fbp=order_data.fbp,
        fbc=order_data.fbc,
        event_id=order_data.event_id,
    )

    for item_data in order_data.items:
        item = OrderItem(
            product_id=item_data.product_id,
            product_name=item_data.product_name,
            sku=item_data.sku,
            quantity=item_data.quantity,
            offer_type=item_data.offer_type,
            pieces_per_bundle=item_data.pieces_per_bundle,
            unit_price=item_data.unit_price,
            is_upsell=item_data.is_upsell,
        )
        order.items.append(item)

    db.add(order)
    await db.commit()
    await db.refresh(order)

    return {
        "order_id": order.order_id,
        "status": order.status,
        "total_price": float(order.total_price),
        "created_at": order.created_at.isoformat(),
        "customer_name": order.customer_name,
        "phone": order.phone,
        "city": order.city,
        "items": [],
    }


@router.post("/orders/{order_id}/upsell")
async def add_upsell(
    order_id: str,
    upsell_data: UpsellAdd,
    db: AsyncSession = Depends(get_db),
):
    order = await get_order_with_items(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    upsell_item = OrderItem(
        order_id=order.id,
        product_id=upsell_data.product_id,
        product_name=upsell_data.product_name,
        sku=upsell_data.sku,
        quantity=upsell_data.quantity,
        offer_type=upsell_data.offer_type,
        pieces_per_bundle=upsell_data.pieces_per_bundle,
        unit_price=upsell_data.unit_price,
        is_upsell=True,
    )
    order.total_price = float(order.total_price) + float(upsell_data.unit_price)
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
    await db.refresh(order)

    background_tasks.add_task(send_to_sheets, order_id)
    background_tasks.add_task(send_purchase_capi, order, order.event_id)

    return {"status": "confirmed"}


@router.get("/orders/{order_id}")
async def get_order(order_id: str, db: AsyncSession = Depends(get_db)):
    order = await get_order_with_items(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_id": order.order_id,
        "status": order.status,
        "total_price": float(order.total_price),
        "created_at": order.created_at.isoformat(),
        "customer_name": order.customer_name,
        "phone": order.phone,
        "city": order.city,
        "items": [
            {
                "product_name": i.product_name,
                "sku": i.sku,
                "quantity": i.quantity,
                "unit_price": float(i.unit_price),
                "offer_type": i.offer_type,
                "is_upsell": i.is_upsell,
            }
            for i in order.items
        ],
    }
