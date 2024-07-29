import querystring from 'qs';
import crypto from 'crypto';
import { format } from 'date-fns-tz';
import config from '../config/vnpayConfig.json' assert { type: 'json' };
import ConnectionDB from '../config/connectionDB';

class vnpayService {
    async createPaymentUrl(orderInfo, amount, ipAddr, bankCode, orderType, locale) {
        const tmnCode = config.vnp_TmnCode;
        const secretKey = config.vnp_HashSecret;
        const vnpUrl = config.vnp_Url;
        const returnUrl = config.vnp_ReturnUrl;

        const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ +7
        const date = new Date();
        const createDate = format(date, 'yyyyMMddHHmmss', { timeZone });
        const expireDate = format(new Date(date.getTime() + 15 * 60 * 1000), 'yyyyMMddHHmmss', { timeZone }); // Thêm 15 phút
        const orderId = format(date, 'HHmmss', { timeZone });

        if (!locale) {
            locale = 'vn';
        }

        const currCode = 'VND';
        let vnp_Params = {
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
            vnp_ExpireDate: expireDate
        };

        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        // Sắp xếp các tham số theo thứ tự chữ cái
        const sortedParams = this.sortObject(vnp_Params);

        // Tạo dữ liệu chữ ký
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams['vnp_SecureHash'] = signed;

        return vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false });
    }

    async sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
          }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
          sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
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
                'UPDATE `orders` SET state = "spending" WHERE order_id = ?',
                ['banked', orderId.toString()]
            );
            return vnp_Params['vnp_ResponseCode'];
        } else {
            return '97';
        }
    }
}

const VNPAYService = new vnpayService();
export default VNPAYService;
