export default interface CartContextType {
    cartCount: number;
    cartItems: any[];
    totalPrice: number;
    updateCartCount: () => void;
    addToCart: (item: any) => void;
    removeFromCart: (index: number) => void;
    updateItemQuantity: (index: number, delta: number) => void;
  }