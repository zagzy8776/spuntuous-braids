import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CreditCard, Heart, Mail, MapPin, Menu, MessageCircle, PackageCheck, Phone, ShoppingBag, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const location = useLocation();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const linkClass = ({ isActive }) => `block py-3 text-[17px] font-medium transition ${isActive ? 'text-amber-700' : 'text-stone-800 hover:text-amber-700'}`;

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf1] text-stone-900">
      <RouteTracker />
      <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#fffaf1]/95 backdrop-blur-xl">
        <PromoStrip />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-950 shadow-sm sm:h-11 sm:w-11">
              <img src={logoUrl} alt="Sumptuous Braids logo" className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0 leading-none">
              <strong className="font-display block truncate text-[17px] tracking-wide sm:text-xl">Sumptuous</strong>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[0.22em] text-amber-700 sm:text-[11px] sm:tracking-[0.32em]">Braids</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <a href={`tel:${businessInfo.callLine}`} className="hidden rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 lg:inline-flex">Call: {businessInfo.callLine}</a>
            <Link to="/wishlist" className="relative hidden rounded-full border border-amber-900/20 p-2.5 hover:bg-amber-50 sm:inline-flex" aria-label="Wishlist">
              <Heart size={18} />
              {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="relative rounded-full border border-amber-900/20 p-2 hover:bg-amber-50 sm:p-2.5" aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-amber-600 px-1.5 text-[10px] font-bold text-white">{count}</span>}
            </Link>
            <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-amber-900/20 p-2 lg:hidden sm:p-2.5" aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-stone-950/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <nav className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto border-b border-amber-900/10 bg-[#fffaf1] px-5 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 overflow-hidden rounded-full bg-stone-950">
                  <img src={logoUrl} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="font-display text-lg">Menu</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-amber-900/20 p-2" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col divide-y divide-amber-900/10">
              {nav.map(([label, path]) => <NavLink key={path} to={path} className={linkClass}>{label}</NavLink>)}
              <Link to="/wishlist" className="flex items-center justify-between py-3 text-[17px] font-medium text-stone-800">
                Wishlist
                {wishlistCount > 0 && <span className="rounded-full bg-red-500 px-2 text-xs font-bold text-white">{wishlistCount}</span>}
              </Link>
            </div>
            <div className="mt-6 grid gap-3">
              <a href={`tel:${businessInfo.callLine}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-[16px] font-semibold text-white">
                <Phone size={18} /> Call {businessInfo.phoneDisplay}
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-[16px] font-semibold text-white">
                <MessageCircle size={18} /> WhatsApp us
              </a>
            </div>
          </nav>
        </div>
      )}

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
