import axios from 'axios';
import ProductProps from '@/common/interfaces/productProps';

const deleteProduct = async (product_id: number): Promise<ProductProps | null> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.delete<ProductProps>(`http://localhost:5000/delete-product/${product_id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error delete product:', error);
            return null;
        }
    }
    return null; 
};

export default deleteProduct;
