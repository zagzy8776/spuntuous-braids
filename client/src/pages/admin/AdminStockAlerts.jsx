import { useEffect, useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';

const phoneToWhatsapp = (phone) => phone?.replace(/\D/g, '').replace(/^0/, '234');

export default function AdminStockAlerts() {
  const [alerts, setAlerts] = useState([]);
  const load = () => api.get('/stock-alerts').then((res) => setAlerts(res.data.alerts));
  useEffect(() => { load().catch(() => null); }, []);
  const contacted = async (id) => { await api.put(`/stock-alerts/${id}/contacted`); load(); };
  const remove = async (id) => { if (confirm('Delete alert?')) { await api.delete(`/stock-alerts/${id}`); load(); } };
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Restock Leads</p><h1 className="mt-2 font-display text-4xl font-semibold">Stock Alerts</h1><div className="mt-8 grid gap-4">{alerts.map((alert) => { const msg = encodeURIComponent(`Hello ${alert.customerName || ''}, ${alert.productName} is now available at Sumptuous Braids. Would you like to order?`); return <article key={alert.id} className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm md:grid-cols-[1fr_170px_220px] md:items-center"><div><strong>{alert.productName}</strong><p className="text-sm text-stone-500">{alert.customerName || 'Customer'} · {alert.phone}</p><p className="text-xs text-stone-400">{alert.isContacted ? 'Contacted' : 'Not contacted'}</p></div><button onClick={() => contacted(alert.id)} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">Mark contacted</button><div className="flex gap-2"><a href={`https://wa.me/${phoneToWhatsapp(alert.phone)}?text=${msg}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800"><MessageCircle size={15} /> WhatsApp</a><button onClick={() => remove(alert.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={15} /></button></div></article>; })}{!alerts.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No restock requests yet.</p>}</div></section>;
}