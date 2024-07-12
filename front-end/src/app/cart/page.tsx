'use client';

import styles from './cart.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from 'next/link';
import { useCart } from '@/common/contexts/cartContext';
import { formatCurrency } from '@/common/utils/priceFormat';

const Cart = () => {
    const { cartItems, totalPrice, removeFromCart, updateItemQuantity } = useCart();

    return (
        <div className={`${styles['cart-main']} ${styles['clear-fix']}`}>
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
                        <Link href='/product-detail'>Chi tiết sản phẩm</Link>
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
                <button className={styles['order-btn']}>Đặt hàng</button>
            </div>
        </div>
    );
}

export default Cart;
