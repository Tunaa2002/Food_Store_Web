import styles from './product1.module.css';
import Link from 'next/link';

interface ProductProps {
    productId: number;
    image: string;
    title: string;
    discount: number;
    cost: number;
    rateAvg: number;
    orderNum: number;
}

const Product1: React.FC<ProductProps> = ({ image, productId, title, discount, cost, rateAvg, orderNum }) => {
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
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
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
