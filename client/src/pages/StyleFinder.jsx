import { useMemo, useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { whatsappNumber } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

const options = {
  style: ['Knotless', 'Box braids', 'Stitch', 'Cornrows', 'Boho / Goddess', 'Wig install'],
  size: ['Large', 'Medium', 'Small', 'Micro'],
  length: ['Shoulder', 'Mid-back', 'Waist', 'Hip+'],
  occasion: ['Everyday', 'Work', 'Event', 'Holiday'],
  addons: ['Hair included', 'I will bring hair', 'Need finishing only'],
};

export default function StyleFinder() {
  const [answers, setAnswers] = useState({ style: '', size: '', length: '', occasion: '', addons: '' });
  const complete = Object.values(answers).every(Boolean);
  const recommendation = useMemo(() => (
    complete
      ? `${answers.size} ${answers.style.toLowerCase()} to ${answers.length.toLowerCase()} length for ${answers.occasion.toLowerCase()}. ${answers.addons}.`
      : 'Answer the questions to get a style direction.'
  ), [answers, complete]);
  const message = encodeURIComponent(`Hello Sumptuous Braids, this is my style profile:\nStyle: ${answers.style}\nSize: ${answers.size}\nLength: ${answers.length}\nOccasion: ${answers.occasion}\nHair: ${answers.addons}\n\nPlease advise on price and available booking time.`);

  useEffect(() => {
    setPageMeta({ title: 'Style Finder', description: 'Find the right braid style and send your profile to Sumptuous Braids on WhatsApp.' });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Style Finder</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Find the right braid style.</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Answer a few questions and send your style profile to Sumptuous Braids for a personal WhatsApp recommendation.</p>
      </section>
      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          {Object.entries(options).map(([key, values]) => (
            <div key={key} className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl capitalize">{key === 'addons' ? 'Hair & extras' : key}</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {values.map((value) => (
                  <button key={value} onClick={() => setAnswers({ ...answers, [key]: value })} className={`rounded-full px-5 py-3 text-sm font-semibold ${answers[key] === value ? 'bg-stone-950 text-white' : 'bg-amber-50 text-amber-900'}`}>{value}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-[2rem] bg-stone-950 p-6 text-white">
          <Sparkles className="text-amber-300" />
          <h2 className="mt-4 font-display text-3xl">Your style profile</h2>
          <p className="mt-4 leading-7 text-stone-300">{recommendation}</p>
          <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-4 font-semibold ${complete ? 'bg-green-600 text-white' : 'pointer-events-none bg-white/10 text-stone-400'}`}><MessageCircle size={18} /> Send my style profile</a>
        </aside>
      </section>
    </main>
  );
}
