import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const phoneToWhatsapp = (phone) => phone?.replace(/\D/g, '').replace(/^0/, '234');

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => { api.get('/orders/customers/summary').then((res) => setCustomers(res.data.customers)).catch(() => setCustomers([])); }, []);
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Customer CRM</p><h1 className="mt-2 font-display text-4xl font-semibold">Customers</h1><p className="mt-2 text-stone-600">See repeat buyers, total spend, favorite products, and message them on WhatsApp.</p>
    <div className="mt-8 grid gap-4">{customers.map((customer) => { const msg = encodeURIComponent(`Hello ${customer.name}, Sumptuous Braids has new arrivals and special recommendations for you.`); return <article key={customer.phone} className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-[1fr_160px_180px_160px] md:items-center"><div><strong>{customer.name}</strong><p className="text-sm text-stone-500">{customer.phone} · {customer.email || 'No email'}</p><p className="text-sm text-stone-500">Favorite: {customer.favoriteProduct}</p></div><span>{customer.totalOrders} orders</span><strong>{formatNaira(customer.totalSpent)}</strong><a href={`https://wa.me/${phoneToWhatsapp(customer.phone)}?text=${msg}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800"><MessageCircle size={15} /> Promo</a></article>; })}{!customers.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No customers yet.</p>}</div>
  </section>;
}