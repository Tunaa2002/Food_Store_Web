'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import CartContextType from '../interfaces/cartContext';
import { getCurrentCart, mergeCart, removeCartItem } from '@/app/api/user/cart/cart';

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

  const removeFromCart = async (index: number) => {
    const token = localStorage.getItem('user');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    cart = cart.filter((_: any, i: number) => i !== index);
    if (cart.length === 0) {
        localStorage.removeItem('cart');
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    updateCartCount();
    setCartItems(cart);
    window.dispatchEvent(new Event('storage'));
    if (token) {
        try {
            const { accessToken, expiry } = JSON.parse(token);
            if (new Date().getTime() >= expiry) {
                localStorage.removeItem('user');
                return;
            }
            await removeCartItem(accessToken, cart[index].product_id);
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    }
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

  const syncCart = async () => {
    const {accessToken, expiry} = JSON.parse(localStorage.getItem('user') || '{}');
    if (new Date().getTime() >= expiry) {
        localStorage.removeItem('user');
        return;
    }

    if (accessToken) {
        const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        try {
            await mergeCart(accessToken, localCartItems);
            const serverCart = await getCurrentCart(accessToken);
            setCartItems(serverCart.cartItems);
            calculateTotalPrice(serverCart.cartItems);
            localStorage.setItem('cart', JSON.stringify(serverCart.cartItems));
            setCartCount(serverCart.cartItems.length);
        } catch (error) {
            console.error('Failed to sync cart:', error);
        }
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  useEffect(() => {
    syncCart();
    const interval = setInterval(syncCart, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
