import axios from "axios";
import OrderData from "@/common/interfaces/orderData";

const getOrdersAPI = async (): Promise<OrderData[]> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return [];
        }

        try {
            const response = await axios.get('http://localhost:5000/orders-list', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders list:', error);
            return [];
        }
    }
    return [];
};

export default getOrdersAPI;
