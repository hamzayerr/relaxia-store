'use client'
import { useEffect, useState } from 'react'
import { Search, RefreshCw, X } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
function authHeaders() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('relaxia_admin_token') : ''
  return { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }
}

const STATUS_LABELS: Record<string, string> = {
  pending_upsell: 'جديد',
  confirmed: 'مؤكد',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغى',
  returned: 'مرتجع',
}

const STATUS_COLORS: Record<string, string> = {
  pending_upsell: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-brand-100 text-brand-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-orange-100 text-orange-700',
}

function generateDemoOrders() {
  const names = ['أحمد بنعلي', 'فاطمة الزهراء', 'يوسف العلوي', 'خديجة بناني', 'محمد التازي', 'سارة الإدريسي', 'عمر السعدي', 'نادية المراكشي', 'كريم الفاسي', 'ليلى الحسني', 'حسن بومدين', 'أمينة شكير']
  const cities = ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'مكناس', 'وجدة', 'تطوان', 'القنيطرة']
  const products = [
    { name: 'COLOFLORA', prices: [229, 345, 430] },
    { name: 'PYLOREX', prices: [229, 345, 430] },
    { name: 'FLEXIMA', prices: [229, 345, 430] },
  ]
  const statuses = ['pending_upsell', 'confirmed', 'confirmed', 'confirmed', 'processing', 'shipped', 'shipped', 'delivered', 'delivered', 'cancelled']
  return Array.from({ length: 24 }, (_, i) => {
    const p = products[i % 3]
    const qIdx = Math.floor(Math.random() * 3)
    const qty = qIdx + 1
    const price = p.prices[qIdx]
    return {
      order_id: `RLX-${1000 + i}`,
      created_at: new Date(Date.now() - i * 3600000 * (Math.random() * 4 + 1)).toISOString(),
      customer_name: names[i % names.length],
      phone: `06${Math.floor(10000000 + Math.random() * 89999999)}`,
      city: cities[i % cities.length],
      total_price: price,
      status: statuses[i % statuses.length],
      items: [{ product_name: p.name, quantity: qty, unit_price: price }],
      source: ['facebook', 'tiktok', 'snapchat', 'direct'][i % 4],
      medium: 'cpc',
      sheet_synced: Math.random() > 0.2,
    }
  })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('relaxia_admin_demo') === '1'
    if (isDemo) {
      const demoOrders = generateDemoOrders()
      const filtered = demoOrders.filter(o => {
        if (status && o.status !== status) return false
        if (search) {
          const q = search.toLowerCase()
          return o.customer_name.toLowerCase().includes(q) || o.phone.includes(q) || o.order_id.includes(q)
        }
        return true
      })
      setOrders(filtered)
      setTotal(filtered.length)
      setLoading(false)
      return
    }
    const q = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) q.set('search', search)
    if (status) q.set('status', status)
    const res = await fetch(`${API_URL}/api/admin/orders?${q}`, { headers: authHeaders() })
    const data = await res.json()
    setOrders(data.orders || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, status])

  const updateStatus = async (orderId: string, newStatus: string) => {
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('relaxia_admin_demo') === '1'
    if (isDemo) {
      setOrders(os => os.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o))
      if (selected?.order_id === orderId) setSelected({ ...selected, status: newStatus })
      return
    }
    await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: newStatus }),
    })
    load()
    if (selected?.order_id === orderId) setSelected({ ...selected, status: newStatus })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-cairo font-bold text-2xl text-brand-900">الطلبيات ({total})</h1>
        <button onClick={load} className="flex items-center gap-2 text-brand-700 font-tajawal text-sm">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="بحث: اسم / هاتف / رقم الطلبية" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            className="w-full border border-gray-200 rounded-xl py-2 pr-10 pl-4 text-sm font-tajawal focus:outline-none focus:border-brand-500" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-xl py-2 px-4 text-sm font-tajawal focus:outline-none focus:border-brand-500 bg-white">
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-brand-50 border-b border-brand-100">
              <tr>
                {['رقم الطلبية', 'التاريخ', 'الاسم', 'الهاتف', 'المدينة', 'الإجمالي', 'الحالة', ''].map(h => (
                  <th key={h} className="p-4 font-cairo font-bold text-sm text-brand-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-[#4A6555] font-tajawal">جاري التحميل...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-[#4A6555] font-tajawal">لا طلبيات</td></tr>
              ) : orders.map(o => (
                <tr key={o.order_id} className="hover:bg-brand-50 transition-colors">
                  <td className="p-4 font-cairo font-bold text-brand-700 text-sm">{o.order_id}</td>
                  <td className="p-4 font-tajawal text-sm text-[#4A6555]">{new Date(o.created_at).toLocaleDateString('ar-MA')}</td>
                  <td className="p-4 font-tajawal text-sm text-brand-900">{o.customer_name}</td>
                  <td className="p-4 font-tajawal text-sm" dir="ltr">{o.phone}</td>
                  <td className="p-4 font-tajawal text-sm text-brand-900">{o.city}</td>
                  <td className="p-4 font-cairo font-bold text-sm text-brand-700" dir="ltr">{o.total_price} MAD</td>
                  <td className="p-4">
                    <span className={`text-xs font-cairo font-bold px-2 py-1 rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => setSelected(o)} className="text-brand-700 hover:text-brand-900 text-xs font-tajawal">
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-brand-100">
          <p className="font-tajawal text-sm text-[#4A6555]">عرض {orders.length} من {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-brand-200 text-sm font-cairo text-brand-700 disabled:opacity-40">
              السابق
            </button>
            <span className="px-3 py-1.5 font-cairo text-sm">{page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={orders.length < 20}
              className="px-3 py-1.5 rounded-lg border border-brand-200 text-sm font-cairo text-brand-700 disabled:opacity-40">
              التالي
            </button>
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-cairo font-bold text-xl text-brand-900">طلبية #{selected.order_id}</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="space-y-4 text-sm font-tajawal">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['الاسم', selected.customer_name],
                  ['الهاتف', selected.phone],
                  ['المدينة', selected.city],
                  ['التاريخ', new Date(selected.created_at).toLocaleString('ar-MA')],
                ].map(([label, value]) => (
                  <div key={label} className="bg-brand-50 rounded-xl p-3">
                    <p className="text-[#4A6555] text-xs mb-0.5">{label}</p>
                    <p className="font-bold text-brand-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border border-brand-100 rounded-xl overflow-hidden">
                <div className="bg-brand-50 p-3 font-cairo font-bold text-brand-900">المنتجات</div>
                {(selected.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between p-3 border-t border-brand-50 text-sm">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span className="font-bold text-brand-700">{item.unit_price} MAD</span>
                  </div>
                ))}
                <div className="flex justify-between p-3 border-t border-brand-200 font-bold">
                  <span>المجموع:</span>
                  <span className="text-brand-700">{selected.total_price} MAD</span>
                </div>
              </div>

              <div>
                <p className="font-cairo font-bold text-brand-900 mb-2">تغيير الحالة:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <button key={v} onClick={() => updateStatus(selected.order_id, v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-cairo font-bold transition-colors ${
                        selected.status === v ? 'bg-brand-700 text-white' : 'border border-brand-200 text-brand-700 hover:bg-brand-50'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {selected.source && (
                <div className="bg-gray-50 rounded-xl p-3 text-xs">
                  <p><span className="font-bold">المصدر:</span> {selected.source} / {selected.medium}</p>
                  {selected.fbclid && <p><span className="font-bold">fbclid:</span> {selected.fbclid.slice(0, 20)}...</p>}
                  {selected.ip_address && <p><span className="font-bold">IP:</span> {selected.ip_address}</p>}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span className={selected.sheet_synced ? 'text-green-600' : 'text-orange-500'}>
                  {selected.sheet_synced ? '✅ تمت مزامنة الشيت' : '⏳ لم تتم المزامنة'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
