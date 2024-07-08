'use client'

import React, { useState } from 'react';
import styles from './productsListManage.module.css';
import FilterOption from '@/components/filter-option/filterOption';
import PrivateLayout from '../layout';

const products = [
    {
        id: 1,
        image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsu96vdwxva168@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Trà sữa thái',
        cost: 25000,
        discount: 20000,
        category: 'Trà sữa',
        quantity: 20
    },
    {
        id: 2,
        image: 'https://down-cvs-vn.img.susercontent.com/vn-11134513-7r98o-lvia2nmph7xg7b@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Cheese Coffee',
        cost: 45000,
        discount: 40000,
        category: 'Cà phê',
        quantity: 15
    },
    {
        id: 3,
        image: 'https://down-tx-vn.img.susercontent.com/vn-11134513-7r98o-lstqa2yq1qys29@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Cơm gà xối mỡ',
        cost: 40000,
        discount: 35000,
        category: 'Đồ ăn chính',
        quantity: 10
    },
    {
        id: 4,
        image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsv7jl8ilrix5f@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Bánh mì thập cẩm',
        cost: 35000,
        discount: 30000,
        category: 'Đồ ăn nhanh',
        quantity: 15
    },
    {
        id: 5,
        image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsu96vdwxva168@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Trà sữa thái',
        cost: 25000,
        discount: 20000,
        category: 'Trà sữa',
        quantity: 20
    },
    {
        id: 6,
        image: 'https://down-cvs-vn.img.susercontent.com/vn-11134513-7r98o-lvia2nmph7xg7b@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Cheese Coffee',
        cost: 45000,
        discount: 40000,
        category: 'Cà phê',
        quantity: 15
    },
    {
        id: 7,
        image: 'https://down-tx-vn.img.susercontent.com/vn-11134513-7r98o-lstqa2yq1qys29@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Cơm gà xối mỡ',
        cost: 40000,
        discount: 35000,
        category: 'Đồ ăn chính',
        quantity: 10
    },
    {
        id: 8,
        image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsv7jl8ilrix5f@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Bánh mì thập cẩm',
        cost: 35000,
        discount: 30000,
        category: 'Đồ ăn nhanh',
        quantity: 15
    },
    {
        id: 9,
        image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsu96vdwxva168@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Trà sữa thái',
        cost: 25000,
        discount: 20000,
        category: 'Trà sữa',
        quantity: 20
    },
    {
        id: 10,
        image: 'https://down-cvs-vn.img.susercontent.com/vn-11134513-7r98o-lvia2nmph7xg7b@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Cheese Coffee',
        cost: 45000,
        discount: 40000,
        category: 'Cà phê',
        quantity: 15
    },
    {
        id: 11,
        image: 'https://down-tx-vn.img.susercontent.com/vn-11134513-7r98o-lstqa2yq1qys29@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Cơm gà xối mỡ',
        cost: 40000,
        discount: 35000,
        category: 'Đồ ăn chính',
        quantity: 10
    },
    {
        id: 12,
        image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsv7jl8ilrix5f@resize_ss280x175!@crop_w280_h175_cT',
        name: 'Bánh mì thập cẩm',
        cost: 35000,
        discount: 30000,
        category: 'Đồ ăn nhanh',
        quantity: 15
    },
    
];

function ProductsListManage() {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
        <div className={styles['products-manage']}>
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <h4 className={styles['title']}>Quản lý sản phẩm</h4>
                    <div className={styles['actions']}>
                        <div className={styles['search-form']}>
                            <input className={styles['search-text']} type='text' name='search' placeholder='Nhập tên sản phẩm' />
                            <i className={`${styles['bi']} ${styles['bi-search']} ${styles['search-btn']} ${'bi-search'}`}></i>
                        </div>
                        <button className={styles['add-product']}>Thêm sản phẩm</button>
                    </div>
                </div>
                <div className={styles['products-list']}>
                    <div className={styles['filter']}>
                        <FilterOption />
                    </div>
                    <table className={styles['products-table']}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Giá ưu đãi</th>
                                <th>Loại</th>
                                <th>Số lượng</th>
                                <th>Chỉnh sửa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td><img src={product.image} alt={product.name} className={styles['product-image']} /></td>
                                    <td>{product.name}</td>
                                    <td>{product.cost}</td>
                                    <td>{product.discount}</td>
                                    <td>{product.category}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button className={styles['edit-btn']}>Sửa</button>
                                        <button className={styles['delete-btn']}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles['pagination']}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo; Trang trước
                    </button>
                    <span className={styles['current-page']}>{currentPage}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau &raquo;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductsListManage;
