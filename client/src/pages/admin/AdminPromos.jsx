import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';

const empty = { title: '', message: '', linkLabel: 'Shop now', linkUrl: '/shop', isActive: true, startsAt: '', endsAt: '' };

export default function AdminPromos() {
  const [banners, setBanners] = useState([]); const [form, setForm] = useState(empty); const [editing, setEditing] = useState(null); const [message, setMessage] = useState('');
  const load = () => api.get('/promos').then((res) => setBanners(res.data.banners));
  useEffect(() => { load().catch(() => null); }, []);
  const submit = async (e) => { e.preventDefault(); const payload = { ...form, startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null, endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null }; if (editing) await api.put(`/promos/${editing}`, payload); else await api.post('/promos', payload); setForm(empty); setEditing(null); setMessage('Promo saved.'); load(); };
  const edit = (b) => { setEditing(b.id); setForm({ ...b, startsAt: b.startsAt ? b.startsAt.slice(0, 10) : '', endsAt: b.endsAt ? b.endsAt.slice(0, 10) : '' }); };
  const remove = async (id) => { if (confirm('Delete promo?')) { await api.delete(`/promos/${id}`); load(); } };
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Promotions</p><h1 className="mt-2 font-display text-4xl font-semibold">Promo Banners</h1>{message && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-green-700">{message}</p>}
    <form onSubmit={submit} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-2"><input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" /><input placeholder="Link URL" value={form.linkUrl || ''} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" /><textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2" /><input placeholder="Link label" value={form.linkLabel || ''} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" /><label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label><button className="rounded-full bg-stone-950 px-6 py-4 font-semibold text-white md:col-span-2">{editing ? 'Update' : 'Add'} Promo</button></form>
    <div className="mt-6 grid gap-4">{banners.map((b) => <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"><div><strong>{b.title}</strong><p className="text-sm text-stone-500">{b.message}</p></div><div className="flex gap-2"><button onClick={() => edit(b)} className="rounded-full bg-amber-50 px-4 py-2 text-amber-800">Edit</button><button onClick={() => remove(b.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={16} /></button></div></div>)}</div>
  </section>;
}