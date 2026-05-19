import { NextRequest, NextResponse } from 'next/server'

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
