import { MessageCircle } from 'lucide-react';
import { business, whatsappUrl } from '../lib/api.js';
export default function FloatingWhatsApp() {
  return <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Chat with Sumptuous Braids on WhatsApp" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#168c43] px-4 py-3 text-sm font-bold text-white shadow-2xl transition hover:scale-105"><MessageCircle size={20}/> WhatsApp</a>;
}
