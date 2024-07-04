import styles from './product1.module.css';
import Link from 'next/link';
import ProductProps from '@/common/interfaces/productProps';


const Product1: React.FC<ProductProps> = ({ image, productId, title, discount, cost, rateAvg, orderNum }) => {
    const renderStars = (rate: number) => {
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
    
    return (
        <div className={styles['product']}>
            <div className={styles['product-container']}>
                <div className={styles['product-image']}>
                    <img
                        src={image}
                        alt='Product Image'
                        className={styles['img']}
                    />
                </div>
                <div className={styles['product-info']}>
                    <div className={styles['title']}>
                        <input
                            name='id'
                            type='hidden'
                            value={productId}
                            className={styles['product-id']}
                        />
                        <h2 className={styles['h2']}>{title}</h2>
                    </div>
                    <div className={styles['price']}>
                        <span className={`${styles['mr8']} ${styles['discount']}`}>{discount} VNĐ</span>
                        <span className={styles['cost']}>{cost} VNĐ</span>
                    </div>
                    <div className={styles['rating']}>
                        <div className={styles['star-icon']}>
                            {renderStars(rateAvg)}
                        </div>
                        <span className={styles['mr8']}>{rateAvg}</span>
                        <span className={styles['order-num']}>
                            {orderNum} lượt mua
                        </span>
                    </div>
                    <Link href='/xem-chi-tiet'>Xem chi tiết</Link>
                    <i className={`${styles['bi']} ${styles['bi-heart-fill']} bi-heart-fill`}></i>
                    <button className={styles['order-btn']}>Đặt hàng</button>
                </div>
            </div>
        </div>
    );
};

export default Product1;
