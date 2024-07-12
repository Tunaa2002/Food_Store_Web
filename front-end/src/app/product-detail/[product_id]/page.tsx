
'use client'

import styles from './productDetail.module.css';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HoverRating from '@/components/rating/rating';
import DefaultComponent from '@/components/comment/comment';
import ProductProps from '@/common/interfaces/productProps';
import { formatCurrency } from '@/common/utils/priceFormat';
import { useCart } from '@/common/contexts/cartContext';

function ProductDetail() {
    const searchParams = useSearchParams();
    const product_id = searchParams.get('product_id');
    const [product, setProduct] = useState<ProductProps | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const productData = localStorage.getItem('productDetail');
        if (productData) {
            setProduct(JSON.parse(productData));
        }
    }, [product_id]);

    if (!product) {
        return <p>Product not found</p>;
    }

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
        const item = { image_url: product.image_url, product_id: product.product_id, name: product.name, discount: product.discount, cost: product.cost, average_rating: product.average_rating, orderNum: product.orderNum };
        addToCart(item);
    };

    return(
        <div className={styles['product-detail']}>
            <div className={styles['container']}>
                <div className={styles['product']}>
                    <div className={styles['product-container']}>
                        <div className={styles['product-image']}>
                            <img
                                src={product.image_url}
                                alt='Product Image'
                                className={styles['img']}
                            />
                        </div>
                        <div className={styles['product-info']}>
                            <div className={styles['title']}>
                                <input
                                    name='id'
                                    type='hidden'
                                    value={product.product_id}
                                    className={styles['product-id']}
                                />
                                <h2 className={styles['h2']}>{product.name}</h2>
                            </div>
                            <div className={styles['price']}>
                                <span className={`${styles['mr8']} ${styles['discount']}`}>{formatCurrency(product.discount)} VNĐ</span>
                                <span className={styles['cost']}>{formatCurrency(product.cost)} VNĐ</span>
                            </div>
                            <div className={styles['rating']}>
                                <div className={styles['star-icon']}>
                                    {renderStars(product.average_rating)}
                                </div>
                                <span className={styles['mr8']}>({product.average_rating})</span>
                                <span className={styles['order-num']}>
                                    lượt mua ({product.orderNum})
                                </span>
                            </div>
                            <i className={`${styles['bi']} ${styles['bi-heart-fill']} bi-heart-fill`}></i>
                            <button className={styles['order-btn']} onClick={handleOrderClick}>Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
                <div className={styles['user-rating']}>
                    <h3 className={styles['title']}>Đánh giá sản phẩm</h3>
                    <HoverRating />
                </div>
                <div className={styles['comments']}>
                    <DefaultComponent />
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;