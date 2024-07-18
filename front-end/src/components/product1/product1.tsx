'use client'

import styles from './product1.module.css';
import Link from 'next/link';
import ProductProps from '@/common/interfaces/productProps';
import { useCart } from '@/common/contexts/cartContext';
import { formatCurrency } from '@/common/utils/priceFormat';


const Product1: React.FC<ProductProps> = ({ image_url, product_id, name, description, discount, cost, average_rating, quantity }) => {
    const { addToCart } = useCart();
    const renderStars = (rate: number | null | undefined) => {

        if (rate === null || rate === undefined) {
            return null;
        }

        const fullStars = Math.floor(rate);
        const halfStar = rate % 1 >= 0.1 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
        }

        if (halfStar) {
            stars.push(<i key="half" className="bi bi-star-half"></i>);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
        }

        return stars;
    };

    const handleOrderClick = () => {
        const item = { image_url, product_id, name, description, discount, cost, average_rating, quantity };
        addToCart(item);
    };

    const handleProductClick = () => {
        const product = { image_url, product_id, name, description, discount, cost, average_rating, quantity };
        localStorage.setItem('productDetail', JSON.stringify(product));
    };
    
    return (
        <div className={styles['product']}>
            <div className={styles['product-container']}>
                <div className={styles['product-image']}>
                    <img
                        src={image_url}
                        alt='Product Image'
                        className={styles['img']}
                    />
                </div>
                <div className={styles['product-info']}>
                    <div className={styles['title']}>
                        <input
                            name='id'
                            type='hidden'
                            value={product_id}
                            className={styles['product-id']}
                        />
                        <h2 className={styles['h2']}>{name}</h2>
                        <p className={styles['description']}>{description || ''}</p>
                    </div>
                    <div className={styles['price']}>
                        <span className={`${styles['mr8']} ${styles['discount']}`}>{formatCurrency(discount)} VNĐ</span>
                        <span className={styles['cost']}>{formatCurrency(cost)} VNĐ</span>
                    </div>
                    <div className={styles['rating']}>
                        <div className={styles['star-icon']}>
                            {renderStars(average_rating)}
                        </div>
                        <span className={styles['mr8']}>{average_rating}</span>
                        <span className={styles['order-num']}>
                            Còn lại {quantity}
                        </span>
                    </div>
                    <Link href={`/product-detail/${product_id}`} onClick={handleProductClick}>Xem chi tiết</Link>
                    <i className={`${styles['bi']} ${styles['bi-heart-fill']} bi-heart-fill`}></i>
                    <button className={styles['order-btn']} onClick={handleOrderClick}>Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    );
};

export default Product1;
