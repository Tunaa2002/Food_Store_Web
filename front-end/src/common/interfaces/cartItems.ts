export default interface CartItem {
    product_id: string;
    quantity: number;
    discount: number;
    image_url?: string;
    name?: string;
}