'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import checkPaymentStatusAPI from '@/app/api/user/order/vnpayReturn';
import styles from './payment.module.css';
import Link from 'next/link';

function Payment() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            if (!vnp_ResponseCode) {
                setError('Thiếu thông tin phản hồi từ VNPAY.');
                return;
            }

            const token = localStorage.getItem('user');
            if (token) {
                const { accessToken, expiry } = JSON.parse(token);

                if (new Date().getTime() >= expiry) {
                    localStorage.removeItem('user');
                    setError('Token expired');
                    return;
                }

                try {
                    const data = await checkPaymentStatusAPI(vnp_ResponseCode, accessToken);

                    if (data.status === true) {
                        setStatus('success');
                    } else {
                        setStatus('fail');
                    }
                } catch (error) {
                    setStatus('fail');
                    setError('Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán.');
                }
            } else {
                setError('No token found');
            }
        };

        checkPaymentStatus();
    }, [searchParams]);

    return (
        <div className={styles['payment-main']}>
            {status === 'success' ? (
                <div>
                    <h4>Thanh toán thành công</h4>
                    <Link href="/">Chuyển đến trang chủ</Link>
                </div>
            ) : status === 'fail' ? (
                <div>
                    <h4>Thanh toán thất bại</h4>
                    <Link href="/order">Quay lại đặt hàng</Link>
                </div>
            ) : (
                <p>Đang kiểm tra trạng thái thanh toán...</p>
            )}
            {error && <p className={styles['error']}>{error}</p>}
        </div>
    );
}

export default Payment;
