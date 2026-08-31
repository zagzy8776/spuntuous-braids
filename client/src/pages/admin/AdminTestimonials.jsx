import { useEffect, useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';

const empty = { name: '', quote: '', location: 'Owerri', rating: 5, isActive: true };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/testimonials/admin/all').then((res) => setItems(res.data.testimonials));
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Unable to load testimonials.')); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await api.post('/testimonials', { ...form, rating: Number(form.rating) });
      setForm(empty);
      setMessage('Testimonial added.');
      load();
    } catch (err) { setError(err.response?.data?.message || 'Could not save testimonial.'); }
  };

  const remove = async (id) => { if (confirm('Delete testimonial?')) { await api.delete(`/testimonials/${id}`); setMessage('Testimonial deleted.'); load(); } };

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Social Proof</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Testimonials</h1>
        <p className="mt-2 text-stone-600">Add customer reviews that appear on the homepage.</p>
      </div>
      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700"><CheckCircle2 size={18} /> {message}</div>}
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{error}</p>}
      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-2">
        <input required placeholder="Customer name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
        <textarea required placeholder="Review/testimonial" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="min-h-28 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2" />
        <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show publicly</label>
        <button className="rounded-full bg-stone-950 px-6 py-4 font-semibold text-white md:col-span-2">Add Testimonial</button>
      </form>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <article key={item.id} className="rounded-[2rem] bg-white p-5 shadow-sm"><p className="text-amber-600">{'★'.repeat(item.rating)}</p><p className="mt-3 text-sm leading-6 text-stone-600">“{item.quote}”</p><div className="mt-4 flex items-center justify-between"><div><strong>{item.name}</strong><p className="text-xs text-stone-500">{item.location} · {item.isActive ? 'Visible' : 'Hidden'}</p></div><button onClick={() => remove(item.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={16} /></button></div></article>)}
      </div>
    </section>
  );
}