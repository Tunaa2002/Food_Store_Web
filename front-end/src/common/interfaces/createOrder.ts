import CartItem from "./cartItems";

export default interface CreateOrder {
    address: string;
    phone: string;
    payment_id: string;
    cartItems: CartItem[];
    totalPrice: number;
}