import axios from "axios";
import OrderDetailData from "@/common/interfaces/orderDetail";

const getOrderDetailAPI = async (order_id: string): Promise<OrderDetailData[]> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return [];
        }

        try {
            const response = await axios.get(`http://localhost:5000/order-detail/${order_id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order detail:', error);
            return [];
        }
    }
    return [];
};

export default getOrderDetailAPI;
