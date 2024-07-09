'use client'
import styles from './cart.module.css';
import { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from 'next/link';

const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(items);
        calculateTotalPrice(items);
    }, []);

    const calculateTotalPrice = (items: any[]) => {
        let total = 0;
        items.forEach(item => {
            const itemTotal = item.discount * item.quantity;
            total += itemTotal;
        });
        setTotalPrice(total);
    };

    const handleRemoveItem = (index: number) => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        calculateTotalPrice(updatedCartItems);

        window.dispatchEvent(new Event('storage'));
    };

    const handleQuantityChange = (index: number, delta: number) => {
        const updatedCartItems = [...cartItems];
        const newQuantity = updatedCartItems[index].quantity + delta;
        if (newQuantity >= 1) {
            updatedCartItems[index].quantity = newQuantity;
            setCartItems(updatedCartItems);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            calculateTotalPrice(updatedCartItems);
        }
    };

    return (
        <div className={`${styles['cart-main']} ${styles['clear-fix']}`}>
            {cartItems.map((item: any, index: number) => (
                <div key={index} className={styles['cart-container']}>
                    <div className={styles['image']}>
                        <img
                            src={item.image}
                            alt='Product Image'
                            className={styles['img']}
                        />
                    </div>
                    <div className={styles['product-content']}>
                        <h4 className={styles['title']}>{item.title}</h4>
                        <p className={styles['price']}>{item.discount} VNĐ</p>
                        <div className={styles['quantity-container']}>
                            <i className="bi bi-dash-circle" onClick={() => handleQuantityChange(index, -1)}></i>
                            <p>Số lượng: {item.quantity}</p>
                            <i className="bi bi-plus-circle" onClick={() => handleQuantityChange(index, 1)}></i>
                        </div>
                        <Link href='/product-detail'>Chi tiết sản phẩm</Link>
                        <p className={styles['products-price-total']}>
                            Tổng: {item.discount * item.quantity} VNĐ
                        </p>
                        <button className={styles['remove-btn']} onClick={() => handleRemoveItem(index)}>Xóa sản phẩm</button>
                    </div>
                </div>
            ))}
            <div className={styles['total']}>
                <div className={styles['total-price']}>
                    Tổng giá trị đơn hàng:
                    <span className={styles['span']}>{totalPrice} VNĐ</span>
                </div>
                <button className={styles['order-btn']}>Đặt hàng</button>
            </div>
        </div>
    );
}

export default Cart;
