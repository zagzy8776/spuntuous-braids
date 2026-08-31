import { useEffect } from 'react';
import { businessInfo } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

export default function About() {
  useEffect(() => {
    setPageMeta({ title: 'About', description: 'Sumptuous Braids is a professional braiding studio and hair brand in Owerri.' });
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">About</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">A beauty brand built around the client.</h1>
      <p className="mt-6 text-lg leading-8 text-stone-600">{businessInfo.brand} brings professional braid installation and branded hair essentials together under one roof. Clients visit the studio for polished work, shop products for their hair routine, and businesses can stock the brand through wholesale.</p>
      <p className="mt-4 text-lg leading-8 text-stone-600">We are located at {businessInfo.location}.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {['Professional braid installation', 'Branded hair products', 'Wholesale support for salons and stores'].map((item) => (
          <div key={item} className="rounded-[2rem] bg-white p-6 font-semibold shadow-sm">{item}</div>
        ))}
      </div>
    </main>
  );
}
