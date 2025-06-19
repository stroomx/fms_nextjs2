'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({
  franchise: null,
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ franchise: null, items: [] });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => {
    setCart((prev) => {
      if (prev.franchise && prev.franchise !== item.franchise_id) {
        return { franchise: item.franchise_id, items: [item] };
      }
      if (prev.items.find((i) => i.schedule_id === item.schedule_id)) return prev;
      return { franchise: item.franchise_id, items: [...prev.items, item] };
    });
  };

  const removeItem = (schedule_id) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.schedule_id !== schedule_id),
    }));
  };

  const clearCart = () => setCart({ franchise: null, items: [] });

  return (
    <CartContext.Provider value={{ ...cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
