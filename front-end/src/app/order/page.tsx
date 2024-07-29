'use client';

import styles from './order.module.css';
import { useCart } from '@/common/contexts/cartContext';
import { formatPrice } from '@/common/utils/formatPrice';
import { useState, useEffect } from 'react';
import createOrderAPI from '../api/user/order/createOrder';
import createPaymentUrlAPI from '../api/user/order/createPaymentUrl';

function Order() {
    const { cartItems, totalPrice, updateCartCount } = useCart();
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [bankCode, setBankCode] = useState('NCB');
    const [error, setError] = useState('');
    const [amount, setAmount] = useState(totalPrice); 
    const [orderDescription, setOrderDescription] = useState(`Thanh toán đơn hàng thời gian: ${new Date().toLocaleString()}`);
    const [orderType] = useState('billpayment');
    const [language] = useState('vn');

    useEffect(() => {
        setAmount(totalPrice); // Cập nhật amount khi totalPrice thay đổi
    }, [totalPrice]);

    const handleOrder = async () => {
        setError(''); // Clear previous errors
        if (!address || !phone) {
            setError('Vui lòng điền tất cả các trường bắt buộc!');
            return;
        }
    
        if (paymentMethod === 'vnpay' && (!orderDescription || !bankCode)) {
            setError('Vui lòng điền đầy đủ thông tin thanh toán VNPAY!');
            return;
        }
    
        const orderData = {
            address,
            phone,
            payment_id: paymentMethod === 'cash' ? 'cash' : 'vnpay',
            cartItems,
            totalPrice,
            orderDescription, // Include orderDescription
        };
    
        try {
            const orderResponse = await createOrderAPI(orderData); // Tạo đơn hàng trước
    
            if (paymentMethod === 'cash') {
                // Xử lý thanh toán khi nhận hàng
                localStorage.removeItem('cart');
                updateCartCount();
                alert('Đặt hàng thành công!');
                window.location.href = "/";
            } else if (paymentMethod === 'vnpay') {
                // Xử lý thanh toán bằng VNPAY
                const paymentData = {
                    amount,
                    orderDescription,
                    orderType,
                    bankCode,
                    language
                };
                const { url } = await createPaymentUrlAPI(paymentData);
                window.location.href = url; // Chuyển hướng người dùng đến URL thanh toán
            }
        } catch (error) {
            setError('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className={styles['order-main']}>
            <div className={styles['order-container']}>
                <h2>Thông tin đơn hàng</h2>
                {cartItems.length === 0 ? (
                    <p>Giỏ hàng của bạn hiện đang trống.</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className={styles['cart-item']}>
                            <img src={item.image_url} alt={item.name} className={styles['img']} />
                            <h4>{item.name}</h4>
                            <p>{formatPrice(item.discount)} VNĐ x {item.quantity}</p>
                            <p>Tổng: {formatPrice(item.discount * item.quantity)} VNĐ</p>
                        </div>
                    ))
                )}

                <h3>Tổng giá trị đơn hàng: {formatPrice(totalPrice)} VNĐ</h3>

                <h3>Địa chỉ nhận hàng</h3>
                <input 
                    type="text" 
                    placeholder="Địa chỉ" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Số điện thoại" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                />

                <h3>Phương thức thanh toán</h3>
                <div>
                    <label>
                        <input 
                            type="radio" 
                            value="cash" 
                            checked={paymentMethod === 'cash'} 
                            onChange={() => setPaymentMethod('cash')} 
                        />
                        Thanh toán khi nhận hàng
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="vnpay" 
                            checked={paymentMethod === 'vnpay'} 
                            onChange={() => setPaymentMethod('vnpay')} 
                        />
                        Thanh toán qua VNPAY
                    </label>
                </div>

                {paymentMethod === 'vnpay' && (
                    <div>
                        <h3>Thông tin thanh toán VNPAY</h3>
                        <p>Tổng tiền đơn hàng: {formatPrice(amount)} VNĐ</p>
                        <input 
                            type="text" 
                            placeholder="Mô tả đơn hàng" 
                            value={orderDescription} 
                            onChange={(e) => setOrderDescription(e.target.value)} 
                        />
                        <select value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
                            <option value="NCB">NCB</option>
                            <option value="VISA">VISA</option>
                        </select>
                        <select value={language} disabled>
                            <option value="vn">Tiếng Việt</option>
                        </select>
                        <button onClick={handleOrder} className={styles['order-btn']}>Thanh toán</button>
                    </div>
                )}

                {error && <p className={styles['error']}>{error}</p>}

                {paymentMethod === 'cash' && (
                    <button onClick={handleOrder} className={styles['order-btn']}>Đặt hàng</button>
                )}
            </div>
        </div>
    );
}

export default Order;
