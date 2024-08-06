import { format } from 'date-fns-tz';
import VNPAYService from "../services/vnpayService.js";

class vnpayController {
    async createPaymentUrl(req, res) {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const { amount, bankCode, orderDescription, orderType, language } = req.body;

        try {
            const timeZone = 'Asia/Ho_Chi_Minh';
            const currentTime = new Date();
            const formattedTime = format(currentTime, 'yyyyMMddHHmmss', { timeZone });

            const extendedOrderDescription = `${orderDescription} thời gian: ${formattedTime}`;

            const paymentUrl = await VNPAYService.createPaymentUrl(extendedOrderDescription, amount, ipAddr, bankCode, orderType, language);
            res.json({ url: paymentUrl });
        } catch (error) {
            console.error('Error in createPaymentUrl:', error);
            res.status(500).send('An error occurred while creating the payment URL.');
        }
    }

    async vnpayReturn(req, res) {
        const vnp_Params = req.query;
        
        try {
            const isSuccess = await VNPAYService.vnpayReturn(vnp_Params);
            res.json({ status: isSuccess }); // Trả về true hoặc false
        } catch (error) {
            console.error('Error in vnpayReturn:', error);
            res.status(500).json({ status: false, message: 'An error occurred during the payment return process.' });
        }
    }
}

const VNPAYController = new vnpayController();
export default VNPAYController;
