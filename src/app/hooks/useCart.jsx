'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({ items: [], addItem: () => {}, removeItem: () => {}, clearCart: () => {} });

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      if (prev.find((i) => i.schedule_id === item.schedule_id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (schedule_id) => {
    setItems((prev) => prev.filter((i) => i.schedule_id !== schedule_id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
