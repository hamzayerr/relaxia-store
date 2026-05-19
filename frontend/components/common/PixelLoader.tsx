'use client'
import { useEffect } from 'react'
import { initFacebookPixel, initTikTokPixel, initSnapchatPixel } from '@/lib/pixels'

export default function PixelLoader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const fb = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
      const tt = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
      const snap = process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
      if (fb) initFacebookPixel(fb)
      if (tt) initTikTokPixel(tt)
      if (snap) initSnapchatPixel(snap)
    }, 0)
    return () => clearTimeout(timer)
  }, [])
  return null
}
