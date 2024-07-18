'use client'

import styles from './categories.module.css';
import React, { useEffect, useState } from 'react';
import Category from '@/common/interfaces/categories';
import getCategories from '@/app/api/user/categories/getCategories';



function CategoriesManage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const categoryPerPage = 10;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

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
                            <button className={styles['add-category']}>Thêm loại sản phẩm</button>
                        </div>
                    </div>
                    <div className={styles['categories-list']}>
                        <table className={styles['categories-table']}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên loại sản phẩm</th>
                                    <th>Số sản phẩm</th>
                                    <th>Chỉnh sửa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCategories.map((category, index) => (
                                    <tr key={index}>
                                        <td>{category.category_id}</td>
                                        <td>{category.name}</td>
                                        <td>{category.product_count}</td>
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
