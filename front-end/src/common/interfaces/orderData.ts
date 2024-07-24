import CartItem from "./cartItems";

export default interface OrderData {
    address: string;
    phone: string;
    payment_id: string;
    cartItems: CartItem[];
    totalPrice: number;
}