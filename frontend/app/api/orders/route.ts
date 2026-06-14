import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

const MOROCCAN_PHONE_REGEX = /^(06|07)\d{8}$/

function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `RLX-${timestamp}-${random}`
}

function readOrders(): unknown[] {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeOrders(orders: unknown[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, city, quantity, totalPrice, product } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'الرجاء إدخال اسم صحيح' }, { status: 400 })
    }
    if (!phone || typeof phone !== 'string' || !MOROCCAN_PHONE_REGEX.test(phone.trim())) {
      return NextResponse.json({ success: false, error: 'الرجاء إدخال رقم هاتف مغربي صحيح (يبدأ بـ 06 أو 07)' }, { status: 400 })
    }
    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'الرجاء إدخال مدينتك' }, { status: 400 })
    }
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ success: false, error: 'الكمية غير صحيحة' }, { status: 400 })
    }
    if (!totalPrice || typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json({ success: false, error: 'السعر غير صحيح' }, { status: 400 })
    }

    const orderId = generateOrderId()
    const order = {
      orderId,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      quantity,
      totalPrice,
      product: product || 'keranex',
      createdAt: new Date().toISOString(),
    }

    const orders = readOrders()
    orders.push(order)
    writeOrders(orders)

    console.log(`[orders] new order saved: ${orderId}`)

    return NextResponse.json({ success: true, orderId, message: 'تم استلام طلبك' })
  } catch (err) {
    console.error('[orders] failed to process order', err)
    return NextResponse.json({ success: false, error: 'حدث خطأ، حاول مرة أخرى' }, { status: 500 })
  }
}
