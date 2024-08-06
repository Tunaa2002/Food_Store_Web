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
      if (cart[productIndex].quantity < cart[productIndex].maxQuantity) {
        cart[productIndex].quantity += 1;
      }
    } else {
      cart.push({ ...item, quantity: 1, maxQuantity: item.quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };

  const removeFromCart = async (index: number) => {
    const token = localStorage.getItem('user');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productId = cart[index].product_id;

    cart = cart.filter((_: any, i: number) => i !== index);
    if (cart.length === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    updateCartCount();
    setCartItems(cart);

    if (token) {
      try {
        const { accessToken, expiry } = JSON.parse(token);
        if (new Date().getTime() >= expiry) {
          localStorage.removeItem('user');
          return;
        }
        await removeCartItem(accessToken, productId);
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
      }
    }
  };

  const updateItemQuantity = (index: number, delta: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let newQuantity = cart[index].quantity + delta;
  
    if (newQuantity >= 1 && newQuantity <= cart[index].maxQuantity) {
      cart[index].quantity = newQuantity;
    } else if (newQuantity < 1) {
      cart[index].quantity = 1;
    } else if (newQuantity > cart[index].maxQuantity) {
      cart[index].quantity = cart[index].maxQuantity;
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };
  
  const syncCart = async () => {
    const token = localStorage.getItem('user');
    if (!token) return;
  
    const { accessToken, expiry } = JSON.parse(token);
    if (new Date().getTime() >= expiry) {
      localStorage.removeItem('user');
      return;
    }
  
    if (accessToken) {
      const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      try {
        await mergeCart(accessToken, localCartItems);
        const serverCart = await getCurrentCart(accessToken);
  
        const mergedCart = mergeCartItems(localCartItems, serverCart.cartItems);
        localStorage.setItem('cart', JSON.stringify(mergedCart));
        setCartItems(mergedCart);
        calculateTotalPrice(mergedCart);
        setCartCount(mergedCart.length);
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    }
  };
  
  const mergeCartItems = (localCart: any[], serverCart: any[]) => {
    const mergedCart: any[] = [];
    const map = new Map();
    serverCart.forEach((serverItem) => {
      map.set(serverItem.product_id, { ...serverItem });
    });
  
    localCart.forEach((localItem) => {
      if (map.has(localItem.product_id)) {
        const existingItem = map.get(localItem.product_id);
        existingItem.quantity = Math.max(existingItem.quantity, localItem.quantity);
        existingItem.maxQuantity = localItem.maxQuantity;
      } else {
        map.set(localItem.product_id, { ...localItem });
      }
    });
  
    map.forEach((value) => {
      mergedCart.push(value);
    });
  
    return mergedCart;
  };
  
  useEffect(() => {
    updateCartCount();
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