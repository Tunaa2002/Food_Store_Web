import axios from 'axios';

const API_URL = 'http://localhost:5000';

interface CartItem {
    product_id: string;
    quantity: number;
    discount: number;
    image_url?: string;
    name?: string;
}

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
