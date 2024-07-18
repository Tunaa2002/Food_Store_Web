import axios from 'axios';
import ProductProps from '@/common/interfaces/productProps';

const addProductAPI = async (productData: Omit<ProductProps, 'product_id'>): Promise<ProductProps | null> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.post<ProductProps>('http://localhost:5000/add-product', productData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding product:', error);
            return null;
        }
    }
    return null; 
};

export default addProductAPI;
