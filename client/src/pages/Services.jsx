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
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="luxury-gradient rounded-[1.75rem] p-6 text-white sm:rounded-[2.5rem] sm:p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Professional Services</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Hair artistry with a polished finish.</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Pricing depends on style, size, length and hair provided. Send a photo or description on WhatsApp for an accurate quote and available booking time.</p>
        <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Sumptuous Braids, I want to book a service.')}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950">Book on WhatsApp <MessageCircle size={18} /></a>
      </section>
      <section className="mt-6 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <article key={service.name} className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-amber-900/10 sm:rounded-[2rem] sm:p-6">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-700">0{index + 1}</span>
            <h2 className="mt-3 font-display text-2xl">{service.name}</h2>
            <p className="mt-2 text-stone-600">{service.note}</p>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Sumptuous Braids, I want to ask about ${service.name}.`)}`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-amber-800">Enquire →</a>
          </article>
        ))}
      </section>
    </main>
  );
}
