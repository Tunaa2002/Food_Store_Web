'use client';

import styles from './cart.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from 'next/link';
import { useCart } from '@/common/contexts/cartContext';
import { formatCurrency } from '@/common/utils/priceFormat';
import { useState } from 'react';

const Cart = () => {
    const { cartItems, totalPrice, removeFromCart, updateItemQuantity } = useCart();
    const [showModal, setShowModal] = useState(false);

    const handleOrder = () => {
        const token = localStorage.getItem('user');
        if (!token) {
            setShowModal(true);
        } else {
            window.location.href = '/order';
        }
    };

    const handleConfirmLogin = () => {
        window.location.href = '/sign-in';
    };

    const handleProductClick = (product_id: number) => {
        const product = { product_id };
        localStorage.setItem('productDetail', JSON.stringify(product));
    };

    return (
        <div className={`${styles['cart-main']} ${styles['clear-fix']}`}>
            {cartItems.length === 0 ? (
                <div className={styles['empty-cart']}>
                    <i className={`${styles['cart-logo']} bi bi-cart`}></i>
                    <p>Giỏ hàng của bạn hiện đang trống</p>
                </div>
                ) : (
                <div>
                    {cartItems.map((item: any, index: number) => (
                        <div key={index} className={styles['cart-container']}>
                            <div className={styles['image']}>
                                <img
                                    src={item.image_url}
                                    alt='Product Image'
                                    className={styles['img']}
                                />
                            </div>
                            <div className={styles['product-content']}>
                                <h4 className={styles['title']}>{item.name}</h4>
                                <p className={styles['price']}>{formatCurrency(item.discount)} VNĐ</p>
                                <div className={styles['quantity-container']}>
                                    <i className="bi bi-dash-circle" onClick={() => updateItemQuantity(index, -1)}></i>
                                    <p>Số lượng: {item.quantity}</p>
                                    <i className="bi bi-plus-circle" onClick={() => updateItemQuantity(index, 1)}></i>
                                </div>
                                <Link href={`/product-detail/${item.product_id}`} onClick={() => handleProductClick(item.product_id)}>Chi tiết sản phẩm</Link>
                                <p className={styles['products-price-total']}>
                                    Tổng: {formatCurrency(item.discount * item.quantity)} VNĐ
                                </p>
                                <button className={styles['remove-btn']} onClick={() => removeFromCart(index)}>Xóa sản phẩm</button>
                            </div>
                        </div>
                    ))}
                    <div className={styles['total']}>
                        <div className={styles['total-price']}>
                            Tổng giá trị đơn hàng:
                            <span className={styles['span']}>{formatCurrency(totalPrice)} VNĐ</span>
                        </div>
                        <button className={styles['order-btn']} onClick={handleOrder}>Đặt hàng</button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className={styles['modal']}>
                    <div className={styles['modal-content']}>
                        <h3>Bạn chưa đăng nhập!</h3>
                        <p>Bạn có muốn đến trang đăng nhập không?</p>
                        <button onClick={handleConfirmLogin}>Đến trang đăng nhập</button>
                        <button onClick={() => setShowModal(false)}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
