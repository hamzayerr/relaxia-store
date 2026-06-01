import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || ''
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''
const FB_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || ''
const FB_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || '974930055129956'

function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

function normalizePhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  // Morocco phones: 06XXXXXXXX → +2126XXXXXXXX
  if (digits.startsWith('0')) return '212' + digits.slice(1)
  if (digits.startsWith('212')) return digits
  return digits
}

async function sendFacebookConversion(order: any) {
  if (!FB_ACCESS_TOKEN || !FB_PIXEL_ID) return

  try {
    const phoneNormalized = normalizePhone(order.phone || '')
    const name = (order.name || '').toLowerCase().trim()
    const [firstName = '', ...rest] = name.split(' ')
    const lastName = rest.join(' ')

    const userData: any = {
      client_user_agent: order.userAgent || '',
    }
    if (phoneNormalized) userData.ph = [hashSHA256(phoneNormalized)]
    if (firstName) userData.fn = [hashSHA256(firstName)]
    if (lastName) userData.ln = [hashSHA256(lastName)]
    if (order.city) userData.ct = [hashSHA256(order.city.toLowerCase().trim())]
    if (order.fbp) userData.fbp = order.fbp
    if (order.fbc) userData.fbc = order.fbc

    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: order.eventId || order.orderId, // For deduplication with browser pixel
        action_source: 'website',
        event_source_url: 'https://www.relaxia.store/thank-you',
        user_data: userData,
        custom_data: {
          currency: 'MAD',
          value: order.totalPrice || 0,
          content_ids: [order.sku || 'unknown'],
          content_name: order.product || '',
          content_type: 'product',
          order_id: order.orderId || '',
        },
      }],
    }

    await fetch(`https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.error('Facebook CAPI failed:', e)
  }
}

async function sendTelegramNotification(order: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return

  const message = `🎉 *طلب جديد!*
━━━━━━━━━━━━━━━━

📦 *المنتج:* ${order.product || '—'}
🏷️ *SKU:* ${order.sku || '—'}
🔢 *الكمية:* ${order.quantity || 1}

👤 *الاسم:* ${order.name || '—'}
📱 *الهاتف:* \`${order.phone || '—'}\`
🏙️ *المدينة:* ${order.city || '—'}

💰 *المجموع:* *${order.totalPrice || 0} درهم*

🆔 \`${order.orderId || '—'}\`
📅 ${order.date || new Date().toLocaleString('ar-MA')}`

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
  } catch (e) {
    console.error('Telegram notification failed:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Send Telegram notification (fire-and-forget, non-blocking)
    sendTelegramNotification(body).catch(() => {})

    // Send Facebook Conversions API event (fire-and-forget)
    sendFacebookConversion(body).catch(() => {})

    if (!SHEETS_URL) {
      return NextResponse.json({ ok: true, note: 'no sheet url' })
    }
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    })
    const text = await res.text()
    return NextResponse.json({ ok: true, response: text })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
