'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('relaxia_admin_token') : ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#0B4D2E',
  processing: '#1B7344',
  shipped: '#2980B9',
  delivered: '#27AE60',
  cancelled: '#C0392B',
  returned: '#E67E22',
  pending_upsell: '#95A5A6',
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [chart, setChart] = useState<any>(null)
  const [range, setRange] = useState('30')

  useEffect(() => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('relaxia_admin_demo') === '1'
    if (isDemo) {
      const days = parseInt(range)
      const daily = Array.from({ length: days }, (_, i) => {
        const d = new Date(Date.now() - (days - 1 - i) * 86400000)
        return { date: `${d.getMonth() + 1}/${d.getDate()}`, orders: Math.floor(Math.random() * 15) + 3 }
      })
      const totalOrders = daily.reduce((s, d) => s + d.orders, 0)
      setMetrics({
        total_orders: totalOrders,
        total_revenue: totalOrders * 287,
        avg_order_value: 287,
        conversion_rate: 3.2,
        orders_by_status: {
          confirmed: Math.floor(totalOrders * 0.45),
          delivered: Math.floor(totalOrders * 0.30),
          shipped: Math.floor(totalOrders * 0.12),
          processing: Math.floor(totalOrders * 0.08),
          cancelled: Math.floor(totalOrders * 0.05),
        },
      })
      setChart({
        daily,
        by_product: [
          { product_name: 'COLOFLORA', orders: Math.floor(totalOrders * 0.5) },
          { product_name: 'PYLOREX', orders: Math.floor(totalOrders * 0.3) },
          { product_name: 'FLEXIMA', orders: Math.floor(totalOrders * 0.2) },
        ],
      })
      return
    }
    const end = new Date().toISOString()
    const start = new Date(Date.now() - parseInt(range) * 86400000).toISOString()
    const q = `?start_date=${start}&end_date=${end}`

    Promise.all([
      fetch(`${API_URL}/api/admin/metrics${q}`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/api/admin/metrics/chart${q}`, { headers: authHeaders() }).then(r => r.json()),
    ]).then(([m, c]) => { setMetrics(m); setChart(c) }).catch(() => {})
  }, [range])

  const cards = metrics ? [
    { label: 'إجمالي الطلبيات', value: metrics.total_orders, icon: '📦' },
    { label: 'رقم الأعمال (MAD)', value: `${(metrics.total_revenue || 0).toFixed(0)}`, icon: '💰' },
    { label: 'متوسط الطلبية', value: `${(metrics.avg_order_value || 0).toFixed(0)} MAD`, icon: '📊' },
    { label: 'معدل التحويل', value: `${metrics.conversion_rate}%`, icon: '🎯' },
  ] : []

  const pieData = metrics ? Object.entries(metrics.orders_by_status || {}).map(([name, value]) => ({ name, value })) : []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cairo font-bold text-2xl text-brand-900">لوحة التحكم</h1>
        <div className="flex gap-2">
          {[['7', '7 أيام'], ['30', '30 يوم'], ['90', '3 أشهر']].map(([v, l]) => (
            <button key={v} onClick={() => setRange(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-cairo font-bold transition-colors ${
                range === v ? 'bg-brand-700 text-white' : 'bg-white border border-brand-200 text-brand-700 hover:bg-brand-50'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-brand-100 p-5">
            <div className="text-3xl mb-2">{c.icon}</div>
            <p className="font-cairo font-extrabold text-2xl text-brand-700">{c.value}</p>
            <p className="font-tajawal text-sm text-[#4A6555] mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Orders over time */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-100 p-5">
          <h3 className="font-cairo font-bold text-brand-900 mb-4">الطلبيات عبر الزمن</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chart?.daily || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4E8DD" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#0B4D2E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-2xl border border-brand-100 p-5">
          <h3 className="font-cairo font-bold text-brand-900 mb-4">حالة الطلبيات</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}`}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || '#95A5A6'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[#4A6555] font-tajawal">لا بيانات</div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(STATUS_COLORS).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1 text-xs font-tajawal">
                <span className="w-3 h-3 rounded-full" style={{ background: c }} />
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Products bar */}
      {chart?.by_product && (
        <div className="bg-white rounded-2xl border border-brand-100 p-5 mb-8">
          <h3 className="font-cairo font-bold text-brand-900 mb-4">الطلبيات حسب المنتج</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chart.by_product} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#D4E8DD" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="product_name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="orders" fill="#0B4D2E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
