'use client'
import { useEffect, useState } from 'react'
import { getScarcityMessage } from '@/lib/utils'

export default function ScarcityBanner() {
  const [msg, setMsg] = useState('')
  useEffect(() => { setMsg(getScarcityMessage()) }, [])
  if (!msg) return null
  return (
    <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-cairo font-semibold px-4 py-2.5 rounded-xl animate-pulse">
      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
      {msg}
    </div>
  )
}
