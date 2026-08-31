import { Link, NavLink, Outlet } from 'react-router-dom';
import { CreditCard, Heart, Mail, MapPin, Menu, MessageCircle, PackageCheck, Phone, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { businessInfo, logoUrl, whatsappNumber } from '../lib/api.js';
import FloatingWhatsApp from './FloatingWhatsApp.jsx';
import RouteTracker from './RouteTracker.jsx';
import PromoStrip from './PromoStrip.jsx';

const nav = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['Services', '/services'],
  ['Wholesale', '/wholesale'],
  ['Gallery', '/gallery'],
  ['Blog', '/blog'],
  ['Delivery', '/delivery'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const linkClass = ({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'}`;

  return (
    <div className="min-h-screen bg-[#fffaf1] text-stone-900">
      <RouteTracker />
      <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#fffaf1]/90 backdrop-blur-xl">
        <PromoStrip />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-stone-950 shadow-sm">
              <img src={logoUrl} alt="Sumptuous Braids logo" className="h-full w-full object-cover" />
            </span>
            <span>
              <strong className="font-display text-xl tracking-wide">Sumptuous</strong>
              <span className="block text-xs uppercase tracking-[0.35em] text-amber-700">Braids</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map(([label, path]) => <NavLink key={path} to={path} className={linkClass}>{label}</NavLink>)}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`tel:${businessInfo.callLine}`} className="rounded-full border border-amber-900/20 p-3 transition hover:bg-amber-100 lg:hidden" aria-label={`Call Sumptuous Braids on ${businessInfo.callLine}`}><Phone size={19} /></a>
            <a href={`tel:${businessInfo.callLine}`} className="hidden rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 lg:inline-flex">Call: {businessInfo.callLine}</a>
            <Link to="/wishlist" className="relative rounded-full border border-amber-900/20 p-3 hover:bg-amber-100" aria-label="Wishlist">
              <Heart size={19} />
              {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="relative rounded-full border border-amber-900/20 p-3 hover:bg-amber-100">
              <ShoppingBag size={19} />
              {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-amber-600 px-1.5 text-xs font-bold text-white">{count}</span>}
            </Link>
            <button onClick={() => setOpen(!open)} className="rounded-full border border-amber-900/20 p-3 lg:hidden"><Menu size={19} /></button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-amber-900/10 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-4">
              {nav.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={linkClass}>{label}</NavLink>)}
            </div>
          </nav>
        )}
      </header>
      <Outlet />
      <FloatingWhatsApp />
      <footer className="bg-stone-950 text-stone-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h3 className="font-display text-2xl text-white">{businessInfo.name}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">Professional braid installation, branded hair products, and wholesale supply from our studio at 86 Wethral Road, opposite Premium Trust Bank.</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300">Quick Links</h4>
            <div className="mt-4 grid gap-2 text-sm text-stone-400">
              <Link to="/services">Book a Service</Link>
              <Link to="/shop">Shop Products</Link>
              <Link to="/wholesale">Wholesale</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300">Studio Support</h4>
            <p className="mt-4 text-sm text-stone-400">Appointments, product orders, payment confirmation, and wholesale enquiries are handled with care.</p>
            <div className="mt-5 grid gap-3 text-sm text-stone-300">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-amber-200"><MessageCircle size={17} className="text-green-400" /> WhatsApp: {businessInfo.phoneDisplay}</a>
              <a href={`tel:${businessInfo.callLine}`} className="flex items-center gap-3 transition hover:text-amber-200"><Phone size={17} className="text-amber-300" /> Call: {businessInfo.callLine}</a>
              <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-3 transition hover:text-amber-200"><Mail size={17} className="text-amber-300" /> {businessInfo.email}</a>
              <span className="flex items-center gap-3"><CreditCard size={17} className="text-amber-300" /> Bank transfer / pay on delivery</span>
              <span className="flex items-center gap-3"><PackageCheck size={17} className="text-amber-300" /> Order and booking confirmation</span>
              <span className="flex items-center gap-3"><Truck size={17} className="text-amber-300" /> Studio pickup and Owerri delivery</span>
              <a href={businessInfo.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-amber-200"><MapPin size={17} className="text-red-400" /> {businessInfo.addressShort}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
