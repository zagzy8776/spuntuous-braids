import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, waMessages, whatsappHref } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';
import MediaCard from '../components/MediaCard.jsx';

const HOME_PRODUCTS_PER_BATCH = 12;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredWork, setFeaturedWork] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageMeta({ title: 'Sumptuous Braids', description: 'Professional unisex braid installation and branded hair care from a trusted studio in Owerri.' });
    fetchProducts(1, false);
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
    api.get('/gallery/featured').then((res) => {
      const featured = res.data.images || [];
      if (featured.length) {
        setFeaturedWork(featured);
        return null;
      }
      return api.get('/gallery?limit=8');
    }).then((res) => {
      if (res?.data?.images) setFeaturedWork(res.data.images);
    }).catch(() => setFeaturedWork([]));
  }, []);

  const fetchProducts = async (targetPage = 1, shouldScroll = true) => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${targetPage}&limit=${HOME_PRODUCTS_PER_BATCH}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination || { total: res.data.products.length, totalPages: 1, hasMore: false });
      setPage(targetPage);
      if (shouldScroll) document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setProducts([]);
      setPagination({ total: 0, totalPages: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, pagination.totalPages || 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, pagination.totalPages]);

  return (
    <main>
      <section className="luxury-gradient relative overflow-hidden text-white">
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-16">
          <p className="mb-4 inline-flex rounded-full border border-amber-300/30 px-3 py-1.5 text-xs text-amber-200 sm:px-4 sm:py-2 sm:text-sm">Sumptuous Braids · Owerri</p>
          <h1 className="font-display text-[2rem] font-semibold leading-[1.15] sm:text-6xl">Beautiful braids. A sumptuous finish.</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-200 sm:text-lg">Professional unisex braid installation and branded hair care from your number one trusted studio in Owerri. Book a style, shop the products, or stock your shelf all in one place.</p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-[16px] font-semibold text-stone-950 hover:bg-amber-300">Book a service <ArrowRight size={18} /></Link>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link to="/shop" className="rounded-full border border-white/20 px-4 py-3.5 text-center text-[15px] font-semibold text-white hover:bg-white/10 sm:px-6">Shop products</Link>
              <a href={whatsappHref(waMessages.heroWhatsApp)} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-4 py-3.5 text-center text-[15px] font-semibold text-white hover:bg-white/10 sm:px-6">WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:-mt-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          <Link to="/services" className="rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 sm:rounded-[2rem] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">01</p>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">Salon services</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Unisex braid installation, wig installation, styling and finishing.</p>
          </Link>
          <Link to="/shop" className="rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 sm:rounded-[2rem] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">02</p>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">Branded products</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Hair oil, edge control, braiding extensions and care essentials.</p>
          </Link>
          <Link to="/gallery" className="rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 sm:rounded-[2rem] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">03</p>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">Our work</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Photos and videos of finished styles from the studio.</p>
          </Link>
        </div>
      </section>

      {featuredWork.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Studio work</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">See the finish</h2>
            </div>
            <Link to="/gallery" className="font-semibold text-amber-800">Open gallery</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {featuredWork.map((item) => (
              <MediaCard key={item.id} item={item} className="w-44 shrink-0 sm:w-56" />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <Link to="/shop" className="shrink-0 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">All Products</Link>
          {categories.slice(0, 10).map((category) => (
            <Link key={category.id} to={`/shop?category=${category.slug}`} className="shrink-0 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10">{category.name}</Link>
          ))}
        </div>
      </section>

      <section id="home-products" className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Shop</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Available Products</h2>
          </div>
          <Link to="/shop" className="font-semibold text-amber-800">View all products</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {loading && <p className="py-8 text-center text-stone-500">Loading products...</p>}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button disabled={loading || page <= 1} onClick={() => fetchProducts(page - 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            {pageNumbers.map((pageNumber) => (
              <button key={pageNumber} disabled={loading} onClick={() => fetchProducts(pageNumber)} className={`h-11 w-11 rounded-full text-sm font-bold shadow-sm ${pageNumber === page ? 'bg-stone-950 text-white' : 'bg-white text-stone-800 ring-1 ring-amber-900/10'}`}>{pageNumber}</button>
            ))}
            <button disabled={loading || page >= pagination.totalPages} onClick={() => fetchProducts(page + 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            <p className="w-full text-center text-sm text-stone-500">Page {page} of {pagination.totalPages} · {pagination.total} products</p>
          </div>
        )}
        {!products.length && !loading && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">Products will appear here once they are added from the admin panel.</p>}
      </section>
    </main>
  );
}
