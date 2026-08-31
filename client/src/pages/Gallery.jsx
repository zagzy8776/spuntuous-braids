import { useEffect, useMemo, useState } from 'react';
import { Camera, Search, Sparkles, X } from 'lucide-react';
import { api, isVideoUrl, waMessages, whatsappHref } from '../lib/api.js';

const PAGE_SIZE = 24;

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    ...(search ? { search } : {}),
    ...(featuredOnly ? { featured: 'true' } : {}),
  }).toString(), [page, search, featuredOnly]);

  useEffect(() => {
    setLoading(true);
    api.get(`/gallery?${query}`)
      .then((res) => {
        setImages((current) => page === 1 ? res.data.images : [...current, ...res.data.images]);
        setHasMore(Boolean(res.data.pagination?.hasMore));
      })
      .catch(() => {
        if (page === 1) setImages([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  const resetAndSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const toggleFeatured = () => {
    setFeaturedOnly((value) => !value);
    setPage(1);
  };

  return (
    <main className="relative overflow-hidden bg-[#fffaf1]">
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute right-0 top-80 h-96 w-96 rounded-full bg-stone-900/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="luxury-gradient overflow-hidden rounded-[2.5rem] p-6 text-white shadow-2xl md:p-12">
          <div className="glass-dark rounded-[2rem] p-6 md:p-8">
            <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-amber-300"><Camera size={18} /> Gallery</p>
            <h1 className="mt-3 font-display text-5xl font-semibold">Sumptuous Braids Moments</h1>
            <p className="mt-4 max-w-2xl text-stone-300">Photos and videos of finished styles, product shots and studio work.</p>
          </div>
        </div>

        <div className="glass-luxury sticky top-20 z-20 mt-8 grid gap-3 rounded-[2rem] p-3 md:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-full bg-white/70 px-4 shadow-sm">
            <Search size={18} className="text-stone-500" />
            <input value={search} onChange={(e) => resetAndSearch(e.target.value)} placeholder="Search gallery captions..." className="w-full bg-transparent py-3 outline-none" />
          </label>
          <button onClick={toggleFeatured} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${featuredOnly ? 'bg-stone-950 text-white' : 'bg-white/70 text-stone-800'}`}>
            <Sparkles size={17} /> {featuredOnly ? 'Featured Only' : 'Show Featured'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-6">
          {images.map((image) => {
            const video = isVideoUrl(image.imageUrl);
            return (
              <button key={image.id} onClick={() => setSelected(image)} className="group glass-luxury overflow-hidden rounded-[1.4rem] text-left transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100">
                  {video ? (
                    <video src={image.imageUrl} className="h-full w-full object-cover" muted loop playsInline autoPlay preload="metadata" controls={false} />
                  ) : (
                    <img src={image.imageUrl} alt={image.title || 'Sumptuous Braids gallery'} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-3">
                  <h2 className="line-clamp-2 font-display text-sm font-semibold sm:text-base">{image.title || 'Sumptuous Braids'}</h2>
                  {image.caption && <p className="mt-1 line-clamp-2 text-xs text-stone-600">{image.caption}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {!images.length && !loading && <p className="py-20 text-center text-stone-500">No gallery posts yet.</p>}

        <div className="mt-10 flex justify-center">
          {hasMore && <button onClick={() => setPage((value) => value + 1)} disabled={loading} className="rounded-full bg-stone-950 px-7 py-4 font-semibold text-white hover:bg-amber-700 disabled:opacity-50">{loading ? 'Loading...' : 'Load More'}</button>}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/80 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <article className="glass-card max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3"><button onClick={() => setSelected(null)} className="rounded-full bg-stone-950 p-2 text-white"><X size={18} /></button></div>
            {isVideoUrl(selected.imageUrl) ? (
              <video src={selected.imageUrl} className="max-h-[68vh] w-full bg-black object-contain" controls playsInline />
            ) : (
              <img src={selected.imageUrl} alt={selected.title || 'Gallery'} className="max-h-[68vh] w-full object-contain" />
            )}
            <div className="p-5">
              <h2 className="font-display text-2xl font-semibold">{selected.title || 'Sumptuous Braids'}</h2>
              {selected.caption && <p className="mt-2 text-stone-600">{selected.caption}</p>}
              <a href={whatsappHref(waMessages.gallery(selected.title))} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white">Book this look on WhatsApp</a>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
