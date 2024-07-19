import ProductProps from "@/common/interfaces/productProps";
import axios from "axios";

const API_URL = 'http://localhost:5000';

const getProductDetail = async (product_id: number): Promise<ProductProps | null> => {
    try {
        const response = await axios.get<ProductProps>(`${API_URL}/product-detail/${product_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product detail:', error);
        return null;
    }
}

export default getProductDetail;
