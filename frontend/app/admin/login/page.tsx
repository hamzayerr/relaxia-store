'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Mock/demo mode: accept admin/admin without backend
      if (form.username === 'admin' && form.password === 'admin') {
        localStorage.setItem('relaxia_admin_token', 'demo-token')
        localStorage.setItem('relaxia_admin_demo', '1')
        router.push('/admin')
        return
      }
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      localStorage.setItem('relaxia_admin_token', data.access_token)
      router.push('/admin')
    } catch {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="RELAXIA" className="h-14 w-14 object-contain mx-auto mb-3 mix-blend-multiply" />
          <h1 className="font-cairo font-bold text-2xl text-brand-900">RELAXIA Admin</h1>
          <p className="font-tajawal text-[#4A6555] text-sm">لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">اسم المستخدم</label>
            <input type="text" className="field-input" dir="ltr" value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
          </div>
          <div>
            <label className="field-label">كلمة المرور</label>
            <input type="password" className="field-input" dir="ltr" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-tajawal">{error}</p>}
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>دخول</Button>
        </form>
      </div>
    </div>
  )
}
