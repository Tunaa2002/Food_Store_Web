'use client'

import styles from './categories.module.css';
import React, { useEffect, useState } from 'react';
import Category from '@/common/interfaces/categories';
import getCategories from '@/app/api/user/categories/getCategories';
import AddCategoryModal from '@/components/admin/addCategory/addCategory';
import UpdateCategoryModal from '@/components/admin/updateCategory/updateCategoryModal';
import DeleteCategoryModal from '@/components/admin/deleteCategory/deleteCategoryModal';
import addCategoryAPI from '@/app/api/admin/categories/addCategory';
import deleteCategoryAPI from '@/app/api/admin/categories/deleteCategory';
import updateCategoryAPI from '@/app/api/admin/categories/updateCategory';
import { filterCategoriesByName } from '@/common/utils/filterCategoryByName';

function CategoriesManage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const categoryPerPage = 10;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories) {
            const result = filterCategoriesByName(categories, searchText);
            setFilteredCategories(result);
            setCurrentPage(1);
        }
    }, [searchText, categories]);

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

    const handleAddCategory = async (category_id: string, name: string) => {
        try {
            await addCategoryAPI({ category_id, name });
            await fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleUpdateCategory = async (category_id: string, name: string) => {
        try {
            const updatedCategory = await updateCategoryAPI(category_id, name);
            if (updatedCategory) {
                await fetchCategories();
                setIsUpdateModalOpen(false);
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async (category_id: string) => {
        try {
            const success = await deleteCategoryAPI(category_id);
            if (success) {
                await fetchCategories();
                setIsDeleteModalOpen(false);
            } else {
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const openUpdateModal = (category: Category) => {
        setSelectedCategory(category);
        setIsUpdateModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const indexOfLastCategory = currentPage * categoryPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(filteredCategories.length / categoryPerPage);

    return (
        <div className={styles['categories-manage']}>
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <h4 className={styles['title']}>Quản lý phân loại sản phẩm</h4>
                    <div className={styles['actions']}>
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
                        <button className={styles['add-category']} onClick={() => setIsAddModalOpen(true)}>Thêm loại sản phẩm</button>
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
                                        <button className={styles['edit-btn']} onClick={() => openUpdateModal(category)}>Sửa</button>
                                        <button className={styles['delete-btn']} onClick={() => openDeleteModal(category)}>Xóa</button>
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
            {isAddModalOpen && (
                <AddCategoryModal 
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddCategory}
                />
            )}
            {isUpdateModalOpen && selectedCategory && (
                <UpdateCategoryModal
                    category={selectedCategory}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={handleUpdateCategory}
                />
            )}
            {isDeleteModalOpen && selectedCategory && (
                <DeleteCategoryModal
                    category={selectedCategory}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteCategory}
                />
            )}
        </div> 
    );
}

export default CategoriesManage;
