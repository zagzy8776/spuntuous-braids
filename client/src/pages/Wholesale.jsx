import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappNumber } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

export default function Wholesale() {
  useEffect(() => {
    setPageMeta({ title: 'Wholesale', description: 'Become a Sumptuous Braids stockist. Bulk supply for salons, stores and beauty businesses.' });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Wholesale & Stockists</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Put Sumptuous products on your shelves.</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Salons, beauty stores and resellers can order branded hair products in bulk. Share your business name, location and the products you want to stock.</p>
        <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Sumptuous Braids, I am interested in becoming a stockist.')}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950">Become a stockist <MessageCircle size={18} /></a>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ['Bulk supply', 'Ask about available quantities and wholesale pricing for your business.'],
          ['Retail-ready brand', 'Stock products customers can recognize and reorder from Sumptuous Braids.'],
          ['Coordinated dispatch', 'Orders are confirmed and dispatched based on destination after agreement.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-amber-900/10">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-3 text-stone-600">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
