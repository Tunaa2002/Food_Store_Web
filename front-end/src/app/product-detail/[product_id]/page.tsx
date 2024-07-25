
'use client'

import styles from './productDetail.module.css';
import { useEffect, useState } from 'react';
import HoverRating from '@/components/rating/rating';
// import DefaultComponent from '@/components/comment/comment';
import ProductProps from '@/common/interfaces/productProps';
import { formatPrice } from '@/common/utils/formatPrice';
import { useCart } from '@/common/contexts/cartContext';
import getProductDetail from '@/app/api/user/products/getProductDetail';


function ProductDetail() {
    const [product, setProduct] = useState<ProductProps | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProductDetail = async () => {
            const storedProduct = localStorage.getItem('productDetail');
            if (storedProduct) {
                const parsedProduct = JSON.parse(storedProduct);
                const productId = parsedProduct.product_id;
                
                if (productId) {
                    const fetchedProduct = await getProductDetail(productId);
                    setProduct(fetchedProduct);
                }
            }
        };

        fetchProductDetail();
    }, []);

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
        const item = { image_url: product.image_url, product_id: product.product_id, name: product.name, discount: product.discount, cost: product.cost, rate_avg: product.rate_avg, quantity: product.quantity };
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
                                <span className={`${styles['mr8']} ${styles['discount']}`}>{formatPrice(product.discount)} VNĐ</span>
                                <span className={styles['cost']}>{formatPrice(product.cost)} VNĐ</span>
                            </div>
                            <div className={styles['rating']}>
                                <div className={styles['star-icon']}>
                                    {renderStars(product.rate_avg || 0)}
                                </div>
                                <span className={styles['mr8']}>({product.rate_avg || 0})</span>
                                <span className={styles['order-num']}>
                                    Còn lại ({product.quantity})
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
                {/* <div className={styles['comments']}>
                    <DefaultComponent />
                </div> */}
            </div>
        </div>
    );
}

export default ProductDetail;