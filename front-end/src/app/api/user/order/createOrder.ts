import axios from "axios";
import OrderData from "@/common/interfaces/orderData";

const createOrderAPI = async (orderData: OrderData): Promise<any> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.post('http://localhost:5000/create-order', orderData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
    return null;
};

export default createOrderAPI;