'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cartCount: number;
  cartItems: any[];
  totalPrice: number;
  updateCartCount: () => void;
  addToCart: (item: any) => void;
  removeFromCart: (index: number) => void;
  updateItemQuantity: (index: number, delta: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cartItems.length);
    setCartItems(cartItems);
    calculateTotalPrice(cartItems);
  };

  const calculateTotalPrice = (items: any[]) => {
    let total = 0;
    items.forEach(item => {
      const itemTotal = item.discount * item.quantity;
      total += itemTotal;
    });
    setTotalPrice(total);
  };

  const addToCart = (item: any) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex((cartItem: any) => cartItem.product_id === item.product_id);
    if (productIndex !== -1) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new Event('storage'));
  };

  const removeFromCart = (index: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter((_: any, i: number) => i !== index);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new Event('storage'));
  };

  const updateItemQuantity = (index: number, delta: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newQuantity = cart[index].quantity + delta;
    if (newQuantity >= 1) {
      cart[index].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      window.dispatchEvent(new Event('storage'));
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, totalPrice, updateCartCount, addToCart, removeFromCart, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
