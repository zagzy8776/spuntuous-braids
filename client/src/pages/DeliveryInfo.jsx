import { CreditCard, HelpCircle, MapPin, MessageCircle, PackageCheck, Truck } from 'lucide-react';
import { businessInfo, whatsappNumber } from '../lib/api.js';

const faqs = [
  ['Do you deliver in Owerri?', 'Yes. Sumptuous Braids coordinates delivery within Owerri and can discuss delivery options for other locations.'],
  ['Can I pay on delivery?', 'Pay on delivery may be available depending on location/order. You can also choose bank transfer or WhatsApp confirmation at checkout.'],
  ['Can you recommend a braid style?', 'Yes. Send a photo or describe the style, size, length and whether you will bring hair. We will advise on price and booking time.'],
  ['Do you sell branded hair products?', 'Yes. Hair oil, edge control, extensions and care products can be selected from the shop or requested on WhatsApp.'],
];

export default function DeliveryInfo() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Delivery & Help</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Easy booking and shopping in Owerri.</h1>
        <p className="mt-5 max-w-2xl text-stone-300">Book a service or order products online, then confirm on WhatsApp. Pickup is available at 86 Wethral Road, opposite Premium Trust Bank.</p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          [Truck, 'Owerri delivery', 'Fast coordination for customers in Owerri and nearby areas.'],
          [CreditCard, 'Flexible payment', 'Bank transfer, pay on delivery, or WhatsApp confirmation.'],
          [PackageCheck, 'Order confirmation', 'Every order is saved and sent to WhatsApp for quick follow-up.'],
        ].map(([Icon, title, text]) => (
          <div key={title} className="rounded-[2rem] bg-white p-6 shadow-sm"><Icon className="text-amber-700" /><h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2><p className="mt-2 text-stone-600">{text}</p></div>
        ))}
      </section>

      <section className="mt-10 rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-display text-3xl font-semibold">Current delivery fees</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-amber-50 p-4"><strong>Pickup from store — Free</strong><p className="mt-1 text-sm text-stone-600">Pick up from Sumptuous Braids in Owerri after order confirmation.</p></div>
          <div className="rounded-2xl bg-amber-50 p-4"><strong>Owerri delivery — ₦3,000</strong><p className="mt-1 text-sm text-stone-600">For delivery within Owerri. Rider delivery will be coordinated after confirmation.</p></div>
          <div className="rounded-2xl bg-amber-50 p-4"><strong>Waybill / park dispatch — ₦1,000</strong><p className="mt-1 text-sm text-stone-600">Covers sending your order to the park. Transport/rider may contact you for remaining delivery cost based on location.</p></div>
          <div className="rounded-2xl bg-amber-50 p-4"><strong>Lagos supplier delivery / other states dispatch — Fee confirmed after order</strong><p className="mt-1 text-sm text-stone-600">Lagos orders may be sent directly from our Lagos suppliers with same-day or next-day delivery after confirmation. Other locations are coordinated based on destination.</p></div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3"><HelpCircle className="text-amber-700" /><h2 className="font-display text-3xl font-semibold">Frequently Asked Questions</h2></div>
          <div className="mt-6 grid gap-4">
            {faqs.map(([question, answer]) => <div key={question} className="rounded-2xl bg-amber-50 p-5"><h3 className="font-semibold text-stone-950">{question}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{answer}</p></div>)}
          </div>
        </div>
        <aside className="h-fit rounded-[2.5rem] bg-stone-950 p-7 text-white">
          <h2 className="font-display text-3xl">Need help now?</h2>
          <p className="mt-3 text-stone-300">Chat with Sumptuous Braids for style recommendations, delivery questions, product availability, and wholesale enquiries.</p>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-4 font-semibold text-white"><MessageCircle size={18} /> WhatsApp us</a>
          <a href={businessInfo.mapUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-sm text-amber-200"><MapPin size={16} /> Get directions in Owerri</a>
        </aside>
      </section>
    </main>
  );
}