import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Printer } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
const phoneToWhatsapp = (phone) => phone?.replace(/\D/g, '').replace(/^0/, '234');

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [manualDiscount, setManualDiscount] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const load = () => api.get(`/orders/${id}`).then((res) => setOrder(res.data.order)).catch((err) => setError(err.response?.data?.message || 'Unable to load order.'));
  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => { await api.put(`/orders/${id}/status`, { status }); load(); };
  const updatePayment = async (paymentStatus) => { await api.put(`/orders/${id}/payment-status`, { paymentStatus }); load(); };
  const applyDiscount = async (e) => { e.preventDefault(); await api.put(`/orders/${id}/manual-discount`, { manualDiscount: Number(manualDiscount || 0), discountReason }); setManualDiscount(''); setDiscountReason(''); load(); };
  if (error) return <section className="p-6 lg:p-10"><p className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</p></section>;
  if (!order) return <section className="p-6 lg:p-10">Loading order...</section>;

  const whatsapp = phoneToWhatsapp(order.customerPhone);
  const message = encodeURIComponent(`Hello ${order.customerName}, this is Sumptuous Braids. We are contacting you about order ${order.orderNumber}.`);

  return (
    <section className="p-6 lg:p-10">
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800"><ArrowLeft size={16} /> Back to orders</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Order Details</p><h1 className="mt-2 font-display text-4xl font-semibold">{order.orderNumber}</h1><p className="mt-2 text-stone-600">Placed {new Date(order.createdAt).toLocaleString()}</p></div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-white"><Printer size={16} /> Print</button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl">Items</h2><div className="mt-4 grid gap-3">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 rounded-2xl bg-stone-50 p-4"><span>{item.productName} x {item.quantity}</span><strong>{formatNaira(item.total)}</strong></div>)}</div></div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl">Delivery</h2><p className="mt-3 text-stone-600">Method: <strong>{order.deliveryMethod?.replaceAll('_', ' ')}</strong></p><p className="text-stone-600">Fee: <strong>{formatNaira(order.deliveryFee || 0)}</strong></p><p className="mt-3 text-stone-600">{order.deliveryNote || 'No delivery note.'}</p></div>
          <form onSubmit={applyDiscount} className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl">Manual Discount</h2><p className="mt-2 text-sm text-stone-500">Use this when customer gets a special discount outside normal coupons/sales.</p><div className="mt-4 grid gap-3 md:grid-cols-2"><input type="number" value={manualDiscount} onChange={(e) => setManualDiscount(e.target.value)} placeholder="Discount amount" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" /><input value={discountReason} onChange={(e) => setDiscountReason(e.target.value)} placeholder="Reason e.g. loyal customer" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" /></div><button className="mt-4 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Apply Discount</button>{order.manualDiscount > 0 && <p className="mt-3 text-sm text-stone-600">Current manual discount: {formatNaira(order.manualDiscount)} · {order.discountReason}</p>}</form>
        </div>
        <aside className="grid h-fit gap-4 rounded-[2rem] bg-stone-950 p-6 text-white">
          <h2 className="font-display text-2xl">Customer</h2>
          <p>{order.customerName}</p><p className="text-stone-300">{order.customerPhone}</p>{order.customerEmail && <p className="text-stone-300">{order.customerEmail}</p>}
          <p className="text-stone-300">{order.deliveryAddress}, {order.deliveryCity}</p>
          <div className="border-t border-white/10 pt-4"><div className="flex justify-between"><span>Subtotal</span><strong>{formatNaira(order.subtotal)}</strong></div><div className="mt-2 flex justify-between"><span>Coupon Discount</span><strong>{formatNaira(order.discount)}</strong></div><div className="mt-2 flex justify-between"><span>Manual Discount</span><strong>{formatNaira(order.manualDiscount || 0)}</strong></div><div className="mt-2 flex justify-between"><span>Delivery</span><strong>{formatNaira(order.deliveryFee || 0)}</strong></div><div className="mt-2 flex justify-between text-xl"><span>Total</span><strong>{formatNaira(order.total)}</strong></div></div>
          <div className="rounded-2xl bg-white/10 p-4 text-sm"><p>Payment: <strong>{order.paymentMethod}</strong></p><p>Status: <strong>{order.paymentStatus?.replaceAll('_', ' ') || 'UNPAID'}</strong></p>{order.bankName && <p className="mt-2 text-stone-300">{order.bankName} · {order.accountNumber} · {order.accountName}</p>}<div className="mt-3 flex flex-wrap gap-2"><button onClick={() => updatePayment('UNPAID')} className="rounded-full bg-white/10 px-3 py-2">Unpaid</button><button onClick={() => updatePayment('PAYMENT_REPORTED')} className="rounded-full bg-amber-500 px-3 py-2 text-stone-950">Reported</button><button onClick={() => updatePayment('PAID')} className="rounded-full bg-green-600 px-3 py-2">Mark Paid</button></div></div>
          <select value={order.status} onChange={(e) => updateStatus(e.target.value)} className="rounded-full bg-white/10 px-4 py-3 outline-none">{statuses.map((status) => <option key={status} value={status} className="text-stone-950">{status}</option>)}</select>
          <div className="flex gap-2"><a href={`tel:${order.customerPhone}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Phone size={15} /> Call</a>{whatsapp && <a href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2"><MessageCircle size={15} /> WhatsApp</a>}</div>
        </aside>
      </div>
    </section>
  );
}