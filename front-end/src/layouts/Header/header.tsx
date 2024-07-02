'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "./header.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const { username, role, expiry } = JSON.parse(user);
            if (new Date().getTime() < expiry) {
                setUsername(username);
                setRole(role);
                setIsLoggedIn(true);
            } else {
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        setUsername(null);
        setRole(null);
        setIsLoggedIn(false);
        window.location.href = '/';
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
                        <input className={styles['search-text']} type='text' name='search' placeholder='Nhập tên sản phẩm' />
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
                                <span className={styles['cart-count']}>1</span>
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
                                        <Link href="/products-list-manage" className={styles['nav-link']}>
                                            Quản lý danh sách sản phẩm
                                        </Link>
                                    </li>
                                    <li className={styles['li']}>
                                        <Link href="/products-classify-manage" className={styles['nav-link']}>
                                            Quản lý phân loại sản phẩm
                                        </Link>
                                    </li>
                                    <li className={styles['li']}>
                                        <Link href="/orders-manage" className={styles['nav-link']}>
                                            Quản lý đơn hàng
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className={styles['header-account']}>
                        {isLoggedIn ? (
                            <Link href="/" className={styles['nav-link']} onClick={handleSignOut}>
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
        </div>
    );
};

export default Header;
