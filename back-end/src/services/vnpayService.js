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
                let vnpUrl = vnpayConfig.vnp_Url;
                const returnUrl = vnpayConfig.vnp_ReturnUrl;

                const ipAddr = 'localhost';
                const date = new Date();
                const createDate = this.formatDate(date); // Định dạng ngày giờ
                const orderId = date.getTime().toString();

                const amount = order.Amount;
                const bankCode = order.BankCode || '';

                const orderInfo = order.OrderDescription;
                const orderType = order.OrderType || 'other';
                const locale = order.Language || 'vn';
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

                // Sắp xếp các tham số theo thứ tự bảng chữ cái
                const sortedParams = Object.fromEntries(
                    Object.entries(vnp_Params).sort(([a], [b]) => a.localeCompare(b))
                );

                // Tạo chữ ký
                const signData = querystring.stringify(sortedParams, { encode: false });
                const hmac = crypto.createHmac('sha512', secretKey);
                const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

                sortedParams.vnp_SecureHash = secureHash;

                const vnpUrlWithParams = vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false });
                resolve(vnpUrlWithParams);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Hàm định dạng ngày giờ theo yêu cầu
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    async verifyPaymentResponse(params) {
        return new Promise((resolve, reject) => {
            try {
                const secureHash = params.vnp_SecureHash;
                delete params.vnp_SecureHash;
                delete params.vnp_SecureHashType;

                // Sắp xếp các tham số theo thứ tự bảng chữ cái
                const sortedParams = Object.fromEntries(
                    Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
                );

                // Tạo chữ ký
                const signData = querystring.stringify(sortedParams, { encode: false });
                const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
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
