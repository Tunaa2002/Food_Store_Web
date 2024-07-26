import axios from 'axios';

const createPaymentUrlAPI = async (orderData: any): Promise<{ url: string }> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            throw new Error('Token expired');
        }

        try {
            const response = await axios.post('http://localhost:5000/create-payment-url', orderData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating payment URL:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

export default createPaymentUrlAPI;
