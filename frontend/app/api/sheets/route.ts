import { NextRequest, NextResponse } from 'next/server'

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || ''
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

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
