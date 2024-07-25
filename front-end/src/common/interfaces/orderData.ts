export default interface OrderData {
    order_id: number;
    address: string;
    phone_number: string;
    payment_description: string;
    total_price: number;
    status: string;
    username: string;
    created_at: string;
    updated_at?: string;
}