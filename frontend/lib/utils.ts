import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return `${amount} درهم`
}

export function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

export function validateMoroccanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, '')
  return /^0[5-7]\d{8}$/.test(cleaned)
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone
  return `${phone.slice(0, 4)} *** ${phone.slice(-3)}`
}

export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function getScarcityMessage(): string {
  const messages = [
    'الكمية المتبقية: 7 قطع فقط',
    'الكمية المتبقية: 5 قطع فقط',
    'الكمية المتبقية: 11 قطعة فقط',
    'الكمية المتبقية: 9 قطع فقط',
    'الكمية المتبقية: 6 قطع فقط',
  ]
  const idx = Math.floor(Math.random() * messages.length)
  return messages[idx]
}

export function isBusinessHours(date?: Date): boolean {
  const d = date || new Date()
  const hour = d.getHours()
  return hour >= 9 && hour < 21
}

export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    fbclid: params.get('fbclid') || '',
    ttclid: params.get('ttclid') || '',
  }
}

export function getFbCookies(): { fbp: string; fbc: string } {
  if (typeof document === 'undefined') return { fbp: '', fbc: '' }
  const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, c) => {
    const [k, v] = c.trim().split('=')
    if (k) acc[k] = v || ''
    return acc
  }, {})
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  return {
    fbp: cookies['_fbp'] || '',
    fbc: cookies['_fbc'] || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''),
  }
}
