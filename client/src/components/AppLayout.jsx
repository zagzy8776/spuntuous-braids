import { Link, NavLink, Outlet } from 'react-router-dom';
import { Instagram, Facebook, Menu, ShoppingBag, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { business, whatsappUrl } from '../lib/api.js';
import FloatingWhatsApp from './FloatingWhatsApp.jsx';

const nav = [['Home','/'],['Shop','/shop'],['Services','/services'],['Wholesale','/wholesale'],['Gallery','/gallery'],['About','/about'],['Contact','/contact']];
export default function AppLayout() {
 const [open,setOpen]=useState(false); const {count}=useCart();
 const link=({isActive})=>`text-sm font-semibold transition ${isActive?'text-[#a47638]':'text-stone-700 hover:text-[#a47638]'}`;
 return <div className="min-h-screen bg-[#f8f4ed]">
  <div className="bg-[#15130f] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">Professional braiding • Branded hair products • Wholesale supply • Owerri</div>
  <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f4ed]/95 backdrop-blur-xl">
   <div className="section-shell flex items-center justify-between py-3 sm:py-4">
    <Link to="/" className="flex items-center gap-3"><span className="h-12 w-12 overflow-hidden rounded-full bg-black"><img src="/logo.jpeg" alt="Sumptuous Braids" className="h-full w-full object-cover"/></span><span><strong className="font-display text-xl">Sumptuous Braids</strong><span className="block text-[9px] font-bold uppercase tracking-[.35em] text-[#a47638]">Beauty • Products • Care</span></span></Link>
    <nav className="hidden items-center gap-7 lg:flex">{nav.map(([label,path])=><NavLink key={path} to={path} className={link}>{label}</NavLink>)}</nav>
    <div className="flex items-center gap-2"><a href={whatsappUrl()} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#168c43] px-4 py-2.5 text-sm font-bold text-white sm:inline-flex"><MessageCircle size={17}/> <span className="ml-2">WhatsApp</span></a><Link to="/cart" className="relative rounded-full border border-black/10 p-3"><ShoppingBag size={19}/>{count>0&&<span className="absolute -right-1 -top-1 rounded-full bg-[#a47638] px-1.5 text-[10px] font-bold text-white">{count}</span>}</Link><button onClick={()=>setOpen(!open)} className="rounded-full border border-black/10 p-3 lg:hidden"><Menu size={19}/></button></div>
   </div>
   {open&&<nav className="border-t border-black/5 px-4 py-4 lg:hidden"><div className="section-shell flex flex-col gap-4">{nav.map(([label,path])=><NavLink onClick={()=>setOpen(false)} key={path} to={path} className={link}>{label}</NavLink>)}</div></nav>}
  </header>
  <Outlet/><FloatingWhatsApp/>
  <footer className="mt-16 bg-[#15130f] text-stone-300"><div className="section-shell grid gap-10 py-14 md:grid-cols-3">
   <div><h3 className="font-display text-3xl text-white">Sumptuous Braids</h3><p className="mt-3 max-w-sm text-sm leading-7 text-stone-400">Professional braiding services and a growing range of branded hair products, built around quality, convenience and a premium customer experience.</p></div>
   <div><h4 className="font-semibold text-[#d8b477]">Explore</h4><div className="mt-4 grid gap-2 text-sm"><Link to="/services">Hair Services</Link><Link to="/shop">Shop Products</Link><Link to="/wholesale">Become a Stockist</Link><Link to="/gallery">Our Work</Link></div></div>
   <div><h4 className="font-semibold text-[#d8b477]">Contact</h4><div className="mt-4 grid gap-3 text-sm"><a className="flex gap-2" href={whatsappUrl()}><MessageCircle size={17}/> {business.phone}</a><a className="flex gap-2" href={`tel:${business.phone}`}><Phone size={17}/> Call us</a><a className="flex gap-2" href={`mailto:${business.email}`}><Mail size={17}/> {business.email}</a><span className="flex gap-2"><MapPin size={17}/> {business.address}</span><div className="flex gap-3 pt-2"><a href={business.instagram} target="_blank" rel="noreferrer"><Instagram/></a><a href={business.facebook} target="_blank" rel="noreferrer"><Facebook/></a><a href={business.tiktok} target="_blank" rel="noreferrer" className="font-bold">TikTok</a></div></div></div>
  </div><div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">© {new Date().getFullYear()} Sumptuous Braids. All rights reserved.</div></footer>
 </div>;
}
