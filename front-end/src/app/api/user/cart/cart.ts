import axios from 'axios';
import CartItem from '@/common/interfaces/cartItems';

const API_URL = 'http://localhost:5000';

interface CartResponse {
    cart_id: string;
    user_id: string;
    cartItems: CartItem[];
}

export const getCurrentCart = async (accessToken: string): Promise<CartResponse> => {
    const response = await axios.get<CartResponse>(`${API_URL}/current-cart`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

export const mergeCart = async (accessToken: string, cartItems: CartItem[]): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_URL}/merge-cart`, { cartItems }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
};

export const removeCartItem = async (accessToken: string, productId: string) => {
    const response = await axios.post(`${API_URL}/remove-cart-item`, { productId }, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
};
