import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('sb_cart') || '[]'));
  useEffect(() => localStorage.setItem('sb_cart', JSON.stringify(items)), [items]);
  const add = (product, quantity = 1) => setItems((current) => {
    const found = current.find((item) => item.id === product.id);
    if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
    return [...current, { ...product, quantity }];
  });
  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const update = (id, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  const clear = () => setItems([]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <CartContext.Provider value={{ items, add, remove, update, clear, subtotal, count }}>{children}</CartContext.Provider>;
};
export const useCart = () => useContext(CartContext);
