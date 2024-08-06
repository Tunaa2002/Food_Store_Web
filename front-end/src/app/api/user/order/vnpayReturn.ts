import axios from 'axios';

const checkPaymentStatusAPI = async (vnp_ResponseCode: string, accessToken: string): Promise<any> => {
    try {
        const response = await axios.get('http://localhost:5000/vnpay-return', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'vnp_ResponseCode': vnp_ResponseCode
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
};

export default checkPaymentStatusAPI;
