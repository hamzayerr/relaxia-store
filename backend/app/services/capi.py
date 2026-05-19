import httpx
import hashlib
import time
import asyncio
from typing import Optional
from app.config import settings
from app.models.order import Order


def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


def to_e164(phone: str) -> str:
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("0"):
        return "+212" + phone[1:]
    return phone


async def send_facebook_capi(order: Order, event_id: str) -> None:
    if not settings.FACEBOOK_ACCESS_TOKEN or not settings.FACEBOOK_PIXEL_ID:
        return

    phone_e164 = to_e164(order.phone)
    payload: dict = {
        "data": [{
            "event_name": "Purchase",
            "event_time": int(time.time()),
            "event_id": event_id,
            "action_source": "website",
            "event_source_url": "https://relaxia.store/thank-you",
            "user_data": {
                "ph": [sha256(phone_e164)],
                "ct": [sha256(order.city.lower())],
                "country": [sha256("ma")],
                "client_ip_address": order.ip_address or "",
                "client_user_agent": order.user_agent or "",
                "fbp": order.fbp or "",
                "fbc": order.fbc or "",
            },
            "custom_data": {
                "currency": "MAD",
                "value": float(order.total_price),
                "order_id": order.order_id,
                "content_ids": [item.product_id for item in order.items],
                "content_type": "product",
                "num_items": sum(item.quantity for item in order.items),
            },
        }]
    }
    if settings.FACEBOOK_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.FACEBOOK_TEST_EVENT_CODE

    url = f"https://graph.facebook.com/v20.0/{settings.FACEBOOK_PIXEL_ID}/events"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(url, params={"access_token": settings.FACEBOOK_ACCESS_TOKEN}, json=payload)
    except Exception:
        pass


async def send_tiktok_capi(order: Order, event_id: str) -> None:
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        return

    phone_e164 = to_e164(order.phone)
    payload = {
        "pixel_code": settings.TIKTOK_PIXEL_ID,
        "event": "CompletePayment",
        "event_id": event_id,
        "timestamp": str(int(time.time())),
        "context": {
            "user": {"phone_number": sha256(phone_e164)},
            "ip": order.ip_address or "",
            "user_agent": order.user_agent or "",
            "ttclid": order.ttclid or "",
        },
        "properties": {
            "currency": "MAD",
            "value": float(order.total_price),
            "order_id": order.order_id,
            "content_type": "product",
            "contents": [
                {"content_id": item.product_id, "content_name": item.product_name, "quantity": item.quantity, "price": float(item.unit_price)}
                for item in order.items
            ],
        },
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                "https://business-api.tiktok.com/open_api/v1.3/event/track/",
                headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
                json=payload,
            )
    except Exception:
        pass


async def send_snapchat_capi(order: Order, event_id: str) -> None:
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        return

    phone_e164 = to_e164(order.phone)
    payload = {
        "pixel_id": settings.SNAPCHAT_PIXEL_ID,
        "timestamp": int(time.time() * 1000),
        "event_conversion_type": "WEB",
        "event_type": "PURCHASE",
        "event_id": event_id,
        "user_data": {
            "phone_number": sha256(phone_e164),
            "client_ip_address": order.ip_address or "",
            "client_user_agent": order.user_agent or "",
        },
        "custom_data": {
            "currency": "MAD",
            "price": float(order.total_price),
            "transaction_id": order.order_id,
            "item_ids": [item.product_id for item in order.items],
            "number_items": sum(item.quantity for item in order.items),
        },
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                "https://tr.snapchat.com/v2/conversion",
                headers={"Authorization": f"Bearer {settings.SNAPCHAT_ACCESS_TOKEN}"},
                json=payload,
            )
    except Exception:
        pass


async def send_purchase_capi(order: Order, event_id: Optional[str] = None) -> None:
    if not event_id:
        import random, string
        event_id = "capi_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=16))

    await asyncio.gather(
        send_facebook_capi(order, event_id),
        send_tiktok_capi(order, event_id),
        send_snapchat_capi(order, event_id),
        return_exceptions=True,
    )
