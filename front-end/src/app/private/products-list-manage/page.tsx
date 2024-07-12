'use client'

import React, { useState, useEffect } from 'react';
import styles from './productsListManage.module.css';
import FilterOption from '@/components/filter-option/filterOption';
import Category from '@/common/interfaces/categories';
import { filterByCategories } from '@/common/utils/categoriesFilter';
import { filterByPriceRange } from '@/common/utils/priceFilter';
import ProductProps from '@/common/interfaces/productProps';
import axios from 'axios';

const categoriesList: Category[] = [
    {categoryId: 'F01', name: 'Đồ ăn nhanh'},
    {categoryId: 'F02', name: 'Đồ ăn vặt'},
    {categoryId: 'F03', name: 'Đồ ăn nhẹ'},
    {categoryId: 'F04', name: 'Đồ ăn chính'},
    {categoryId: 'F05', name: 'Đồ ăn chay'},
    { categoryId: 'D01', name: 'Nước ngọt' },
    { categoryId: 'D02', name: 'Nước trái cây' },
    { categoryId: 'D03', name: 'Sữa' },
    { categoryId: 'D04', name: 'Trà sữa' },
    { categoryId: 'D05', name: 'Đồ uống có cồn' },
    { categoryId: 'D06', name: 'Nước khoáng' },
    { categoryId: 'D07', name: 'Cà phê' }
];

const ProductsListManage: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [filteredProductData, setFilteredProductData] = useState<ProductProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategories, priceRange]);

    const fetchData = async () => {
        try {
            const response = await axios.get<ProductProps[]>('http://localhost:5000/products-list');
            let filteredProducts = response.data;
            filteredProducts = filterByCategories(filteredProducts, selectedCategories);
            filteredProducts = filterByPriceRange(filteredProducts, priceRange);
            setFilteredProductData(filteredProducts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const totalPages = Math.ceil(filteredProductData.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProductData.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleCategoryChange = (selectedCategories: string[]) => {
        setSelectedCategories(selectedCategories);
    };

    const handlePriceChange = (priceRange: number[]) => {
        setPriceRange(priceRange);
    };

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
                        <FilterOption
                            categories={categoriesList}
                            onCategoryChange={handleCategoryChange}
                            onPriceChange={handlePriceChange}
                        />
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
                                    <td>{product.product_id}</td>
                                    <td><img src={product.image_url} alt={product.name} className={styles['product-image']} /></td>
                                    <td>{product.name}</td>
                                    <td>{product.cost}</td>
                                    <td>{product.discount}</td>
                                    <td>{product.category_name}</td>
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
};

export default ProductsListManage;
