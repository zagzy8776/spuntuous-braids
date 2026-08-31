import { MessageCircle } from 'lucide-react';
import { whatsappNumber } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import { useEffect } from 'react';

const services = [
  { name: 'Knotless Braids', note: 'Comfortable, neat installation with a polished finish.' },
  { name: 'Box Braids', note: 'Classic, durable styles tailored to your preferred size and length.' },
  { name: 'Stitch Braids', note: 'Clean parts and a refined, professional look.' },
  { name: 'Cornrows & Feed-in Braids', note: 'Sleek designs for everyday wear or special occasions.' },
  { name: 'Boho / Goddess Braids', note: 'Soft, elevated styles with a luxurious finish.' },
  { name: 'Wig Installation', note: 'Secure, natural-looking installation and styling.' },
  { name: 'Hair Styling & Finishing', note: 'Edges, oiling, and finishing for a complete look.' },
  { name: 'Consultation', note: 'Talk through length, size, hair type and timing before you book.' },
];

export default function Services() {
  useEffect(() => {
    setPageMeta({ title: 'Services', description: 'Book professional braid installation and hair styling at Sumptuous Braids in Owerri.' });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="luxury-gradient rounded-[1.5rem] p-5 text-white sm:rounded-[2.5rem] sm:p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300 sm:text-sm sm:tracking-[0.3em]">Professional Services</p>
        <h1 className="mt-3 font-display text-[1.85rem] font-semibold leading-tight sm:text-5xl">Hair artistry with a polished finish.</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-300 sm:mt-4 sm:text-base">Pricing depends on style, size, length and hair provided. Send a photo or description on WhatsApp for an accurate quote and available booking time.</p>
        <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Sumptuous Braids, I want to book a service.')}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-[16px] font-semibold text-stone-950 sm:mt-7">Book on WhatsApp <MessageCircle size={18} /></a>
      </section>
      <section className="mt-5 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <article key={service.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-amber-900/10 sm:rounded-[2rem] sm:p-6">
            <span className="text-[11px] uppercase tracking-[0.28em] text-amber-700">0{index + 1}</span>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">{service.name}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{service.note}</p>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Sumptuous Braids, I want to ask about ${service.name}.`)}`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-amber-800">Enquire →</a>
          </article>
        ))}
      </section>
    </main>
  );
}
