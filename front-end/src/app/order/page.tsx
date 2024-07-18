'use client';

import styles from './order.module.css';
import { useCart } from '@/common/contexts/cartContext';
import { formatCurrency } from '@/common/utils/priceFormat';
import { useState } from 'react';
import { TextField } from '@mui/material';

function Order() {
    const { cartItems, totalPrice } = useCart();
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [error, setError] = useState('');

    const handleOrder = () => {
        if (!address || !phone || (paymentMethod === 'credit' && (!cardNumber || !cardHolderName))) {
            setError('Vui lòng điền tất cả các trường bắt buộc!');
            return;
        }

        const cardNumberPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        if (paymentMethod === 'credit' && !cardNumberPattern.test(cardNumber)) {
            setError('Số thẻ tín dụng phải theo định dạng xxxx-xxxx-xxxx-xxxx (12 số)!');
            return;
        }

        alert('Đặt hàng thành công!');
    };

    return (
        <div className={styles['order-main']}>
            <div className={styles['order-container']}>
                <h2>Thông tin đơn hàng</h2>
                {cartItems.length === 0 ? (
                    <p>Giỏ hàng của bạn hiện đang trống.</p>
                ) : (
                    cartItems.map((item: any, index: number) => (
                        <div key={index} className={styles['cart-item']}>
                            <img src={item.image_url} alt={item.name} className={styles['img']} />
                            <h4>{item.name}</h4>
                            <p>{formatCurrency(item.discount)} VNĐ x {item.quantity}</p>
                            <p>Tổng: {formatCurrency(item.discount * item.quantity)} VNĐ</p>
                        </div>
                    ))
                )}

                <h3>Tổng giá trị đơn hàng: {formatCurrency(totalPrice)} VNĐ</h3>

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
                            value="credit" 
                            checked={paymentMethod === 'credit'} 
                            onChange={() => setPaymentMethod('credit')} 
                        />
                        Thanh toán tín dụng
                    </label>
                </div>

                {paymentMethod === 'credit' && (
                    <div>
                        <label>Số thẻ</label>
                        <input 
                            type="text" 
                            placeholder="xxxx-xxxx-xxxx-xxxx" 
                            value={cardNumber} 
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 16); // chỉ cho phép 12 số
                                const formattedValue = value.match(/.{1,4}/g)?.join('-') || ''; // định dạng xxxx-xxxx-xxxx-xxxx
                                setCardNumber(formattedValue);
                            }} 
                            required 
                        />
                        <label>Tên chủ thẻ</label>
                        <input 
                            type="text" 
                            placeholder="Tên chủ thẻ" 
                            value={cardHolderName} 
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/[^A-Za-z\s]/g, '')
                                    .replace(/\s+/g, ' ')
                                    .toUpperCase()
                                setCardHolderName(value);
                            }} 
                            required 
                        />
                    </div>
                )}

                {error && <p className={styles['error']}>{error}</p>}
                <button onClick={handleOrder} className={styles['order-btn']}>Đặt hàng</button>
            </div>
        </div>
    );
}

export default Order;
