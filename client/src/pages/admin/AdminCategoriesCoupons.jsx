import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Tag, Trash2 } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

export default function AdminCategoriesCoupons() {
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [category, setCategory] = useState({ name: '', description: '' });
  const [coupon, setCoupon] = useState({ code: '', type: 'PERCENTAGE', value: '', isActive: true, expiresAt: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [catRes, couponRes] = await Promise.all([api.get('/categories'), api.get('/coupons')]);
    setCategories(catRes.data.categories);
    setCoupons(couponRes.data.coupons);
  };
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Unable to load settings.')); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      if (editingCategory) await api.put(`/categories/${editingCategory}`, category); else await api.post('/categories', category);
      setCategory({ name: '', description: '' });
      setEditingCategory(null);
      setMessage(editingCategory ? 'Category updated.' : 'Category added.');
      load();
    } catch (err) { setError(err.response?.data?.message || 'Could not add category.'); }
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const payload = { ...coupon, value: Number(coupon.value), expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString() : null };
      if (editingCoupon) await api.put(`/coupons/${editingCoupon}`, payload); else await api.post('/coupons', payload);
      setCoupon({ code: '', type: 'PERCENTAGE', value: '', isActive: true, expiresAt: '' });
      setEditingCoupon(null);
      setMessage(editingCoupon ? 'Coupon updated.' : 'Coupon added.');
      load();
    } catch (err) { setError(err.response?.data?.message || 'Could not add coupon.'); }
  };

  const deleteCategory = async (id) => { if (confirm('Delete category?')) { await api.delete(`/categories/${id}`); setMessage('Category deleted.'); load(); } };
  const deleteCoupon = async (id) => { if (confirm('Delete coupon?')) { await api.delete(`/coupons/${id}`); setMessage('Coupon deleted.'); load(); } };
  const editCategory = (cat) => { setEditingCategory(cat.id); setCategory({ name: cat.name, description: cat.description || '' }); };
  const editCoupon = (item) => { setEditingCoupon(item.id); setCoupon({ code: item.code, type: item.type, value: item.value, isActive: item.isActive, expiresAt: item.expiresAt ? item.expiresAt.slice(0, 10) : '' }); };

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Store Setup</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Brands/Categories & Coupons</h1>
        <p className="mt-2 text-stone-600">Create the exact brand names or product groups you want customers to shop by.</p>
      </div>

      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700"><CheckCircle2 size={18} /> {message}</div>}
      {error && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700"><AlertCircle size={18} /> {error}</div>}

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <div>
          <form onSubmit={addCategory} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl">{editingCategory ? 'Edit Brand/Category' : 'Add Brand/Category'}</h2>
            <input required placeholder="Category name e.g. Hair Oil, Edge Control, Braiding Hair" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <textarea placeholder="Description" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <button className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700">{editingCategory ? 'Update Brand/Category' : 'Add Brand/Category'}</button>
          </form>
          <div className="mt-5 grid gap-3">
            {categories.map((cat) => <div key={cat.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm"><div><strong>{cat.name}</strong><p className="text-sm text-stone-500">{cat._count?.products || 0} products</p></div><div className="flex gap-2"><button onClick={() => editCategory(cat)} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">Edit</button><button onClick={() => deleteCategory(cat.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={16} /></button></div></div>)}
          </div>
        </div>

        <div>
          <form onSubmit={addCoupon} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl">{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</h2>
            <input required placeholder="Code e.g. ROC10" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select value={coupon.type} onChange={(e) => setCoupon({ ...coupon, type: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed Amount</option></select>
              <input required type="number" placeholder="Value" value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            </div>
            <input type="date" value={coupon.expiresAt} onChange={(e) => setCoupon({ ...coupon, expiresAt: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={coupon.isActive} onChange={(e) => setCoupon({ ...coupon, isActive: e.target.checked })} /> Active coupon</label>
            <button className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700">{editingCoupon ? 'Update Coupon' : 'Add Coupon'}</button>
          </form>
          <div className="mt-5 grid gap-3">
            {coupons.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-2xl bg-amber-100 p-3 text-amber-800"><Tag size={16} /></span><div><strong>{item.code}</strong><p className="text-sm text-stone-500">{item.type === 'PERCENTAGE' ? `${item.value}% off` : `${formatNaira(item.value)} off`} · {item.isActive ? 'Active' : 'Inactive'}</p></div></div><div className="flex gap-2"><button onClick={() => editCoupon(item)} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">Edit</button><button onClick={() => deleteCoupon(item.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={16} /></button></div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
