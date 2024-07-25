import vnpayService from '../services/vnpayService.js';

class vnpayController {
    async createPaymentUrl(req, res) {
        const order = req.body;
        try {
            const paymentUrl = await vnpayService.generatePaymentUrl(order);
            res.status(200).json({ paymentUrl });
        } catch (error) {
            console.error('Error creating payment URL:', error);
            res.status(500).json({ message: 'Error creating payment URL' });
        }
    }

    async handlePaymentReturn(req, res) {
        const params = req.query;
        try {
            const isValid = await vnpayService.verifyPaymentResponse(params);
            if (isValid) {
                // Xử lý thông tin giao dịch thành công tại đây
                res.status(200).json({ message: 'Payment successful', data: params });
            } else {
                res.status(400).json({ message: 'Payment verification failed', data: params });
            }
        } catch (error) {
            console.error('Error handling payment return:', error);
            res.status(500).json({ message: 'Error handling payment return' });
        }
    }
}

const VNPAYController = new vnpayController();
export default VNPAYController;
