'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from "./header.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useUser } from '@/common/contexts/userContext';
import { useCart } from '@/common/contexts/cartContext';
import { getProducts } from '@/app/api/user/products/getProducts';
import { filterProductByName } from '@/common/utils/filterByName';
import ProductProps from '@/common/interfaces/productProps';

const Header: React.FC = () => {
    const { username, role, isLoggedIn, signOut } = useUser();
    const { cartCount } = useCart();
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (searchText) {
                const products = await getProducts();
                const filtered = filterProductByName(products, searchText);
                setFilteredProducts(filtered);
                setShowModal(filtered.length > 0);
            } else {
                setFilteredProducts([]);
                setShowModal(false);
            }
        };
        fetchData();
    }, [searchText]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSearchText('');
    };

    const handleProductClick = (product_id: number) => {
        if (!product_id) return;
        const product = { product_id };
        localStorage.setItem('productDetail', JSON.stringify(product));
        handleCloseModal();
    };

    return (
        <div className={`${styles['header-main']}`}>
            <div className={styles['top-header']}>
                <div className={styles['header-container']}>
                    <div className={styles['logo']}>
                        <i className={`${styles['bi']} ${styles['bi-basket-fill']} ${'bi-basket-fill'}`}></i>
                        <span className={styles['logo-text']}>FoodStore</span>
                    </div>
                    <div className={styles['search-form']}>
                        <input 
                            className={styles['search-text']} 
                            type='text' 
                            name='search' 
                            placeholder='Nhập tên sản phẩm' 
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                        <i className={`${styles['bi']} ${styles['bi-search']} ${styles['search-btn']} ${'bi-search'}`}></i>
                    </div>
                    <div className={styles['actions']}>
                        <Link href="/profile" className={styles['nav-link']}>
                            <i className={`${styles['bi']} ${'bi-person-circle'}`}></i>
                            <p className={styles['actions-text']}>{isLoggedIn ? username : 'Tài khoản'}</p>
                        </Link>
                        <Link href="/favorite" className={styles['nav-link']}>
                            <i className={`${styles['bi']} ${'bi-suit-heart-fill'}`}></i>
                            <p className={styles['actions-text']}>Yêu thích</p>
                        </Link>
                        <Link href="/cart" className={styles['nav-link']}>
                            <i className={`${styles['bi']} ${styles['bi-cart4']} ${'bi-cart4'}`}>
                                <span className={styles['cart-count']}>{cartCount}</span>
                            </i>
                            <p className={styles['actions-text']}>Giỏ hàng</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles['bottom-header']}>
                <div className={styles['header-container']}>
                    <div className={styles['header-menu']}>
                        <Link href="/" className={styles['nav-link']}>
                            Trang chủ
                        </Link>
                        <Link href="/foods" className={styles['nav-link']}>
                            Đồ ăn
                        </Link>
                        <Link href="/drinks" className={styles['nav-link']}>
                            Đồ uống
                        </Link>
                        {role === 'admin' && (
                            <div className={`${styles['nav-link']} ${styles['manage']}`}>
                                Quản lý
                                <i className={`${styles['bi']} ${styles['bi-caret-down-fill']} ${'bi-caret-down-fill'}`}></i>
                                <ul className={styles['nav-manage']}>
                                    <li className={styles['li']}>
                                        <Link href="/private/products-list-manage" className={styles['nav-link']}>
                                            Quản lý danh sách sản phẩm
                                        </Link>
                                    </li>
                                    <li className={styles['li']}>
                                        <Link href="/private/categories-manage" className={styles['nav-link']}>
                                            Quản lý phân loại sản phẩm
                                        </Link>
                                    </li>
                                    <li className={styles['li']}>
                                        <Link href="/private/orders-manage" className={styles['nav-link']}>
                                            Quản lý đơn hàng
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className={styles['header-account']}>
                        {isLoggedIn ? (
                            <Link href="/" className={styles['nav-link']} onClick={signOut}>
                                Đăng xuất
                            </Link>
                        ) : (
                            <>
                                <Link href="/sign-in" className={styles['nav-link']}>
                                    Đăng nhập
                                </Link>
                                <span>|</span>
                                <Link href="/sign-up" className={styles['nav-link']}>
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showModal && filteredProducts.length > 0 && (
                <div className={styles['search-modal']} onClick={handleCloseModal}>
                    <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
                        <span className={styles['modal-close']} onClick={handleCloseModal}>&times;</span>
                        {filteredProducts.map(product => (
                            <Link 
                                href={`/product-detail/${product.product_id}`} 
                                key={product.product_id}
                                className={styles['modal-item']}
                                onClick={() => product.product_id && handleProductClick(product.product_id)}
                            >
                                <div className={styles['product']}>
                                    <div className={styles['product-image']}>
                                        <img src={product.image_url} alt={product.name} />
                                    </div>
                                    <div>
                                        <h5 className={styles['product-title']}>{product.name}</h5>
                                        <p>{product.description || null}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
