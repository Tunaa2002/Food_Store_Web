import crypto from 'crypto';
import querystring from 'qs';
import ConnectionDB from '../config/connectionDB.js';
import { vnpayConfig } from '../config/vnpayConfig.js'; 

class vnpayService {
    constructor() {
        this.pool = ConnectionDB.getPool();
    }

    async generatePaymentUrl(order) {
        return new Promise((resolve, reject) => {
            try {
                const tmnCode = vnpayConfig.vnp_TmnCode;
                const secretKey = vnpayConfig.vnp_HashSecret;
                const vnpUrl = vnpayConfig.vnp_Url;
                const returnUrl = vnpayConfig.vnp_ReturnUrl;

                const ipAddr = 'localhost';
                const date = new Date();
                const createDate = date.toISOString().slice(0, 19).replace('T', '');
                const orderId = date.getTime().toString();

                const amount = order.totalPrice;
                const bankCode = order.bankCode || '';

                const orderInfo = order.description;
                const orderType = order.type || 'other';
                const locale = order.locale || 'vn';
                const currCode = 'VND';

                const vnp_Params = {
                    vnp_Version: '2.1.0',
                    vnp_Command: 'pay',
                    vnp_TmnCode: tmnCode,
                    vnp_Locale: locale,
                    vnp_CurrCode: currCode,
                    vnp_TxnRef: orderId,
                    vnp_OrderInfo: orderInfo,
                    vnp_OrderType: orderType,
                    vnp_Amount: amount * 100,
                    vnp_ReturnUrl: returnUrl,
                    vnp_IpAddr: ipAddr,
                    vnp_CreateDate: createDate,
                };

                if (bankCode) {
                    vnp_Params.vnp_BankCode = bankCode;
                }

                vnp_Params.vnp_SecureHashType = 'SHA256';
                const signData = querystring.stringify(vnp_Params);
                const secureHash = crypto.createHmac('sha256', secretKey)
                    .update(Buffer.from(signData, 'utf-8'))
                    .digest('hex');

                vnp_Params.vnp_SecureHash = secureHash;

                const vnpUrlWithParams = vnpUrl + '?' + querystring.stringify(vnp_Params);
                resolve(vnpUrlWithParams);
            } catch (error) {
                reject(error);
            }
        });
    }

    async verifyPaymentResponse(params) {
        return new Promise((resolve, reject) => {
            try {
                const secureHash = params.vnp_SecureHash;
                delete params.vnp_SecureHash;
                delete params.vnp_SecureHashType;

                const sortedParams = Object.fromEntries(
                    Object.entries(params).sort()
                );

                const signData = querystring.stringify(sortedParams);
                const hmac = crypto.createHmac('sha256', vnpayConfig.vnp_HashSecret);
                const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

                resolve(secureHash === signed);
            } catch (error) {
                reject(error);
            }
        });
    }
}

const VNPAYService = new vnpayService();
export default VNPAYService;
