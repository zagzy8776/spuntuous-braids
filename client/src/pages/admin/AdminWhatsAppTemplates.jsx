import { MessageCircle } from 'lucide-react';
import { whatsappNumber } from '../../lib/api.js';

const templates = [
  ['Confirm order', 'Hello, thank you for ordering from Sumptuous Braids. Please confirm your order details and delivery address.'],
  ['Payment details', 'Hello, here are the payment details for your Sumptuous Braids order. Kindly send proof of payment after transfer.'],
  ['Delivery update', 'Hello, your Sumptuous Braids order is being prepared for delivery. We will update you shortly.'],
  ['Out of stock alternative', 'Hello, this item is currently out of stock. We can recommend a similar style or product available now.'],
  ['Thank you message', 'Thank you for shopping with Sumptuous Braids. We appreciate your order and hope you love your hair.'],
  ['Ask for review', 'Hello, thank you for shopping with Sumptuous Braids. Please leave us a Google review if you loved your order.'],
  ['Promo message', 'Hello, Sumptuous Braids has new arrivals and special offers available now. Would you like recommendations?'],
];

export default function AdminWhatsAppTemplates() {
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Automation</p><h1 className="mt-2 font-display text-4xl font-semibold">WhatsApp Templates</h1><p className="mt-2 text-stone-600">One-click message templates for customer follow-up.</p><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{templates.map(([title, text]) => <article key={title} className="rounded-[2rem] bg-white p-5 shadow-sm"><h2 className="font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-6 text-stone-600">{text}</p><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800"><MessageCircle size={15} /> Open WhatsApp</a></article>)}</div></section>;
}