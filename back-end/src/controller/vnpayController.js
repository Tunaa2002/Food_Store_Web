import { format } from 'date-fns-tz';
import VNPAYService from "../services/vnpayService.js";

class vnpayController {
    createPaymentUrl(req, res) {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const { amount, bankCode, orderDescription, orderType, language } = req.body;

        try {
            const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ +7
            const currentTime = new Date();
            const formattedTime = format(currentTime, 'yyyyMMddHHmmss', { timeZone });

            const extendedOrderDescription = `${orderDescription} thời gian: ${formattedTime}`;

            const paymentUrl = VNPAYService.createPaymentUrl(extendedOrderDescription, amount, ipAddr, bankCode, orderType, language);
            res.json({ url: paymentUrl });
        } catch (error) {
            console.error('Error in createPaymentUrl:', error);
            res.status(500).send('An error occurred while creating the payment URL.');
        }
    }
    async verifyReturn(vnp_Params) {
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(vnp_Params);

        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            const orderId = vnp_Params['vnp_TxnRef'];
            await ConnectionDB.query(
                'UPDATE `order` SET state = ? WHERE order_id = ?',
                ['banked', orderId.toString()]
            );
            return vnp_Params['vnp_ResponseCode'];
        } else {
            return '97';
        }
    }
}

const VNPAYController = new vnpayController();
export default VNPAYController;
