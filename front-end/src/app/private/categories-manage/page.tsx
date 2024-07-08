'use client'

import styles from './categories.module.css';
import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';


const categories = [
    {
        category_id: 'F01',
        name: 'Đồ ăn nhanh',
        type: 'Đồ ăn',
    },
    {
        category_id: 'F02',
        name: 'Đồ ăn vặt',
        type: 'Đồ ăn',
    },
    {
        category_id: 'F03',
        name: 'Đồ ăn nhẹ',
        type: 'Đồ ăn',
    },
    {
        category_id: 'F04',
        name: 'Đồ ăn chính',
        type: 'Đồ ăn',
    },
    {
        category_id: 'F05',
        name: 'Đồ ăn chay',
        type: 'Đồ ăn',
    },
    {
        category_id: 'D01',
        name: 'Nước ngọt',
        type: 'Đồ uống',
    },
    {
        category_id: 'D02',
        name: 'Nước trái cây',
        type: 'Đồ uống',
    },
    {
        category_id: 'D03',
        name: 'Sữa',
        type: 'Đồ uống',
    },
    {
        category_id: 'D04',
        name: 'Trà sữa',
        type: 'Đồ uống',
    },
    {
        category_id: 'D05',
        name: 'Đồ uống có cồn',
        type: 'Đồ uống',
    },
    {
        category_id: 'D06',
        name: 'Nước khoáng',
        type: 'Đồ uống',
    },
    {
        category_id: 'D07',
        name: 'Cà phê',
        type: 'Đồ uống',
    },
]

function CategoriesManage() {
    const [currentPage, setCurrentPage] = useState(1);
    const categoryPerPage = 10;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastCategory = currentPage * categoryPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(categories.length / categoryPerPage);

    return (
            <div className={styles['categories-manage']}>
                <div className={styles['container']}>
                    <div className={styles['header']}>
                        <h4 className={styles['title']}>Quản lý phân loại sản phẩm</h4>
                        <div className={styles['actions']}>
                            <div className={styles['search-form']}>
                                <input className={styles['search-text']} type='text' name='search' placeholder='Nhập tên sản phẩm' />
                                <i className={`${styles['bi']} ${styles['bi-search']} ${styles['search-btn']} ${'bi-search'}`}></i>
                            </div>
                            <button className={styles['add-category']}>Thêm sản phẩm</button>
                        </div>
                    </div>
                    <div className={styles['categories-list']}>
                        <table className={styles['categories-table']}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên loại sản phẩm</th>
                                    <th>Thể loại</th>
                                    <th>Chỉnh sửa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCategories.map((category, index) => (
                                    <tr key={index}>
                                        <td>{category.category_id}</td>
                                        <td>{category.name}</td>
                                        <td>{category.type}</td>
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

export default CategoriesManage;
