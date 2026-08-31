import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, MessageCircle, Phone, Search } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
const statusStyles = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
const paymentStyles = {
  UNPAID: 'bg-stone-100 text-stone-700',
  PAYMENT_REPORTED: 'bg-amber-100 text-amber-800',
  PAID: 'bg-green-100 text-green-800',
};

const phoneToWhatsapp = (phone) => phone?.replace(/\D/g, '').replace(/^0/, '234');

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/orders').then((res) => setOrders(res.data.orders)).catch((err) => setError(err.response?.data?.message || 'Unable to load orders.'));
  useEffect(() => { load(); }, []);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const q = search.toLowerCase();
    const matchesSearch = order.orderNumber.toLowerCase().includes(q) || order.customerName.toLowerCase().includes(q) || order.customerPhone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [orders, search, statusFilter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Customer Requests</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Orders</h1>
        <p className="mt-2 text-stone-600">Track customer orders from WhatsApp checkout and update their progress.</p>
      </div>

      {error && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700"><AlertCircle size={18} /> {error}</div>}

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4">
          <Search size={18} className="text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order number, name, phone..." className="w-full bg-transparent py-3 outline-none" />
        </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="ALL">All statuses</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <div className="mt-8 grid gap-5">
        {filteredOrders.map((order) => {
          const whatsapp = phoneToWhatsapp(order.customerPhone);
          const message = encodeURIComponent(`Hello ${order.customerName}, this is Sumptuous Braids. We are contacting you about order ${order.orderNumber}.`);
          return (
            <article key={order.id} className="rounded-[2rem] border border-amber-900/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link to={`/admin/orders/${order.id}`} className="font-display text-2xl hover:text-amber-700">{order.orderNumber}</Link>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>{order.status}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentStyles[order.paymentStatus] || paymentStyles.UNPAID}`}>{(order.paymentStatus || 'UNPAID').replaceAll('_', ' ')}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500">{order.customerName} · {order.customerPhone}</p>
                  <p className="mt-1 text-sm text-stone-500">{order.deliveryAddress}, {order.deliveryCity}</p>
                </div>
                <div className="text-left md:text-right">
                  <strong className="text-xl">{formatNaira(order.total)}</strong>
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="mt-2 block rounded-full bg-stone-100 px-4 py-2 text-sm md:ml-auto">
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-5 grid gap-2 rounded-2xl bg-stone-50 p-4">
                {order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span>{item.productName} x {item.quantity}</span><span>{formatNaira(item.total)}</span></div>)}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-500">
                <p>Payment: {order.paymentMethod} · Delivery: {order.deliveryMethod?.replaceAll('_', ' ')} {formatNaira(order.deliveryFee || 0)} · Discount: {formatNaira((order.discount || 0) + (order.manualDiscount || 0))}</p>
                <div className="flex gap-2">
                  <Link to={`/admin/orders/${order.id}`} className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-900">Details</Link>
                  <a href={`tel:${order.customerPhone}`} className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-stone-800"><Phone size={15} /> Call</a>
                  {whatsapp && <a href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800"><MessageCircle size={15} /> WhatsApp</a>}
                </div>
              </div>
            </article>
          );
        })}
        {!filteredOrders.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No orders found.</p>}
      </div>
    </section>
  );
}
