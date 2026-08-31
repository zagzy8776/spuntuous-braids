import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, ImagePlus, Info, Star, Trash2, UploadCloud } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({ title: '', caption: '', isFeatured: false, isActive: true });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/gallery/admin/all').then((res) => setImages(res.data.images)).catch((err) => setError(err.response?.data?.message || 'Unable to load gallery.'));
  useEffect(() => { load(); }, []);

  const chooseFile = (selectedFile) => {
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : '');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!file) return setError('Please choose a picture from your phone/gallery first.');
    setLoading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('title', form.title);
      body.append('caption', form.caption);
      body.append('isFeatured', String(form.isFeatured));
      body.append('isActive', String(form.isActive));
      await api.post('/gallery', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ title: '', caption: '', isFeatured: false, isActive: true });
      chooseFile(null);
      setMessage('Gallery image uploaded successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Confirm Cloudinary variables are added on Render and redeploy backend.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (image, key) => {
    await api.put(`/gallery/${image.id}`, { title: image.title, caption: image.caption, isFeatured: key === 'isFeatured' ? !image.isFeatured : image.isFeatured, isActive: key === 'isActive' ? !image.isActive : image.isActive });
    load();
  };

  const remove = async (id) => {
    if (confirm('Delete this gallery image?')) {
      await api.delete(`/gallery/${id}`);
      setMessage('Gallery image deleted.');
      load();
    }
  };

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Media</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Gallery</h1>
        <p className="mt-2 text-stone-600">Upload pictures directly from phone gallery. Add a simple title and description so customers know what they are seeing.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ['1. Choose picture', 'Tap the upload box and select from phone gallery or camera.'],
          ['2. Add title', 'Example: New Dior Sauvage Arrival, Luxury Diffuser Set, Premium Body Mist.'],
          ['3. Add caption', 'Write price, style notes, size, promo, or “DM/WhatsApp to order”.'],
        ].map(([title, text]) => (
          <div key={title} className="glass-luxury rounded-[1.5rem] p-4">
            <div className="flex items-center gap-2 font-semibold text-stone-950"><HelpCircle size={17} className="text-amber-700" /> {title}</div>
            <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
          </div>
        ))}
      </div>

      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700"><CheckCircle2 size={18} /> {message}</div>}
      {error && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700"><AlertCircle size={18} /> {error}</div>}

      <form onSubmit={submit} className="mt-8 grid gap-6 rounded-[2.5rem] bg-white/80 p-6 shadow-sm backdrop-blur-xl lg:grid-cols-[320px_1fr]">
        <label className="grid min-h-80 cursor-pointer place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed border-amber-300 bg-amber-50/80 text-center transition hover:bg-amber-100">
          {preview ? <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" /> : <div className="p-8"><ImagePlus className="mx-auto text-amber-700" size={48} /><p className="mt-4 font-semibold">Tap to choose picture</p><p className="mt-2 text-sm text-stone-500">Works from phone gallery/camera.</p><p className="mt-3 text-xs text-stone-400">The full image will show without cropping.</p></div>}
          <input type="file" accept="image/*" onChange={(e) => chooseFile(e.target.files?.[0])} className="hidden" />
        </label>
        <div className="grid content-start gap-4">
          <label>
            <span className="mb-2 block text-sm font-semibold text-stone-700">Post title</span>
            <input placeholder="Example: Knotless braids finish" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-stone-700">Post description / caption</span>
            <textarea placeholder="Example: New hair oil available now. WhatsApp to order." value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="min-h-32 w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          </label>
          <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <div className="flex items-center gap-2 font-semibold"><Info size={16} /> Caption tips</div>
            <p className="mt-1">Mention product or style name, price/size if available, and “WhatsApp to order”. Keep it short.</p>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured image appears first</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show publicly on customer Gallery</label>
          <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-4 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"><UploadCloud size={18} /> {loading ? 'Uploading...' : 'Upload to Gallery'}</button>
        </div>
      </form>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl">Uploaded Pictures</h2>
        <span className="rounded-full bg-white px-4 py-2 text-sm text-stone-600 shadow-sm">{images.length} total</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((image) => (
          <article key={image.id} className="glass-luxury overflow-hidden rounded-[1.5rem]">
            <div className="relative aspect-square">
              <img src={image.imageUrl} alt={image.title || 'Gallery'} className="h-full w-full bg-amber-50 object-contain p-1" />
              <div className="absolute left-2 top-2 flex gap-1">{image.isFeatured && <span className="rounded-full bg-amber-500 p-1 text-white"><Star size={13} /></span>}{!image.isActive && <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] text-white">Hidden</span>}</div>
            </div>
            <div className="p-3">
              <h2 className="line-clamp-2 font-display text-sm font-semibold">{image.title || 'Untitled'}</h2>
              <p className="mt-1 line-clamp-2 text-xs text-stone-500">{image.caption || 'No caption'}</p>
              <div className="mt-3 grid gap-2">
                <button onClick={() => toggle(image, 'isFeatured')} className="rounded-full bg-amber-100 px-3 py-2 text-xs text-amber-900">{image.isFeatured ? 'Unfeature' : 'Feature'}</button>
                <button onClick={() => toggle(image, 'isActive')} className="rounded-full bg-stone-100 px-3 py-2 text-xs text-stone-800">{image.isActive ? 'Hide' : 'Show'}</button>
                <button onClick={() => remove(image.id)} className="rounded-full bg-red-50 px-3 py-2 text-xs text-red-700"><Trash2 className="mx-auto" size={14} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
