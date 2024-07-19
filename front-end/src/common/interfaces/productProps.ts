export default interface ProductProps {
    product_id?: number;
    name: string;
    description: string | null;
    cost: number;
    discount: number;
    category_id: string;
    image_url: string;
    rate_avg?: number | 0;
    quantity: number;
    category_name: string;
}