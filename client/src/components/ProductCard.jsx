import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
export default function ProductCard({ product }) {
  const { add } = useCart();
  return <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white card-shadow">
    <Link to={`/shop/${product.slug}`} className="block aspect-square overflow-hidden bg-[#eee8df]"><img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></Link>
    <div className="p-4 sm:p-5"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#a47638]">{product.category?.name || 'Hair Care'}</p><Link to={`/shop/${product.slug}`}><h3 className="mt-2 font-display text-xl font-semibold">{product.name}</h3></Link><div className="mt-4 flex items-center justify-between gap-3"><strong className="text-lg">₦{Number(product.price).toLocaleString()}</strong><button onClick={() => add(product)} className="inline-flex items-center gap-2 rounded-full bg-[#15130f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a47638]"><ShoppingBag size={16}/>Add</button></div></div>
  </article>;
}
