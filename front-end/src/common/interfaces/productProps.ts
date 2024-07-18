export default interface ProductProps {
    product_id?: number;
    name: string;
    description: string | null;
    cost: number;
    discount: number;
    category_id: string;
    image_url: string;
    average_rating?: number;
    quantity: number;
    orderNum: number;
    category_name: string;
}