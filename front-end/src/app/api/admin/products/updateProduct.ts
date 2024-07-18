import axios from 'axios';
import ProductProps from '@/common/interfaces/productProps';

const updateProduct = async (product_id: number, productData: Omit<ProductProps, 'product_id'>): Promise<ProductProps | null> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.put<ProductProps>(`http://localhost:5000/update-product/${product_id}`, productData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            return null;
        }
    }
    return null; 
};

export default updateProduct;
