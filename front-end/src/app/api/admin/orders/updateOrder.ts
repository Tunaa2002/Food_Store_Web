import axios from 'axios';
import OrderData from '@/common/interfaces/orderData';

const updateOrderStatus = async (order_id: number, status: string): Promise<OrderData | null> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.put<OrderData>(`http://localhost:5000/update-order/${order_id}`, { status }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            return null;
        }
    }
    return null; 
};

export default updateOrderStatus;
