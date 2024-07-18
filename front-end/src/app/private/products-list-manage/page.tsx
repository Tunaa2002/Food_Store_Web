'use client'

import React, { useState, useEffect } from 'react';
import styles from './productsListManage.module.css';
import FilterOption from '@/components/filter-option/filterOption';
import Category from '@/common/interfaces/categories';
import ProductProps from '@/common/interfaces/productProps';
import { formatCurrency } from '@/common/utils/priceFormat';
import getProducts from '@/app/api/user/products/getProducts';
import 'bootstrap-icons/font/bootstrap-icons.css';
import updateProduct from '@/app/api/admin/products/updateProduct';
import addProductAPI from '@/app/api/admin/products/addProduct';
import deleteProduct from '@/app/api/admin/products/deleteProduct';


const categoriesList: Category[] = [
    { category_id: 'F01', name: 'Đồ ăn nhanh' },
    { category_id: 'F02', name: 'Đồ ăn vặt' },
    { category_id: 'F03', name: 'Đồ ăn nhẹ' },
    { category_id: 'F04', name: 'Đồ ăn chính' },
    { category_id: 'F05', name: 'Đồ ăn chay' },
    { category_id: 'D01', name: 'Nước ngọt' },
    { category_id: 'D02', name: 'Nước trái cây' },
    { category_id: 'D03', name: 'Sữa' },
    { category_id: 'D04', name: 'Trà sữa' },
    { category_id: 'D05', name: 'Đồ uống có cồn' },
    { category_id: 'D06', name: 'Nước khoáng' },
    { category_id: 'D07', name: 'Cà phê' }
];

const ProductsListManage: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [filteredProductData, setFilteredProductData] = useState<ProductProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [editProduct, setEditProduct] = useState<ProductProps | null>(null);
    const [addProduct, setAddProduct] = useState<ProductProps | null>(null);
    const [productToDelete, setProductToDelete] = useState<ProductProps | null>(null);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategories, priceRange]);

    const fetchData = async () => {
        const products = await getProducts(selectedCategories, priceRange);
        setFilteredProductData(products);
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

    const handleUpdateProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        if (editProduct) {
            
            if (!editProduct.product_id) {
                console.error('Product ID is missing in editProduct');
                return;
            }
            try {
                const updatedProduct = await updateProduct(editProduct.product_id, editProduct);
                if (updatedProduct) {
                    const category = categoriesList.find(cat => cat.category_id === updatedProduct.category_id);
                    if (category) {
                        updatedProduct.category_name = category.name; 
                    }
    
                    setFilteredProductData(prevProducts =>
                        prevProducts.map(product =>
                            product.product_id === updatedProduct.product_id ? updatedProduct : product
                        )
                    );
                    console.log('Product updated:', updatedProduct);
                    setEditProduct(null);
                }
            } catch (error) {
                console.error('Failed to update product:', error);
            }
        } else {
            console.error('editProduct is null or undefined');
        }
    };
    

    const handleEditClick = (product: ProductProps) => {
        setEditProduct(product);
    };

    const handleAddProductClick = () => {
        setAddProduct({} as ProductProps);
    };

    const handleAddProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        if (addProduct) {
            // console.log('Adding product:', addProduct);
            try {
                const newProduct = await addProductAPI(addProduct);
                if (newProduct) {
                    const category = categoriesList.find(cat => cat.category_id === newProduct.category_id);
                    if (category) {
                        newProduct.category_name = category.name;
                    }
    
                    setFilteredProductData(prevProducts => [...prevProducts, newProduct]);
                    console.log('Product added:', newProduct);
                    setAddProduct(null);
                } else {
                    console.error('Failed to add product: API didnt return new product');
                }
            } catch (error) {
                console.error('Failed to add product:', error);
            }
        } else {
            console.error('Add product data is missing');
        }
    };

    const [deleteProductModalOpen, setDeleteProductModalOpen] = useState<boolean>(false);

    const handleDeleteClick = (product: ProductProps) => {
        setProductToDelete(product);
        setDeleteProductModalOpen(true);
    };

    const handleDeleteConfirm = async (event: React.FormEvent) => {
        event.preventDefault();
        if (productToDelete) {
            if(!productToDelete.product_id) {
                console.error("Product ID is missing in productToDelete");
                return;
            }
            try {
                const deletedProduct = await deleteProduct(productToDelete.product_id);
                if (deletedProduct) {
                    setFilteredProductData(prevProducts =>
                        prevProducts.filter(prod => prod.product_id !== productToDelete!.product_id)
                    );
                    console.log('Product deleted successfully');
                    setDeleteProductModalOpen(false);
                } else {
                    console.error('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
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
                        <button className={styles['add-product']} onClick={handleAddProductClick}>Thêm sản phẩm</button>
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
                                <th>Mô tả</th>
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
                                    <td>{product.description}</td>
                                    <td>{formatCurrency(product.cost)}</td>
                                    <td>{formatCurrency(product.discount)}</td>
                                    <td>{product.category_name}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button className={styles['edit-btn']} onClick={() => handleEditClick(product)}>Sửa</button>
                                        <button className={styles['delete-btn']} onClick={() => handleDeleteClick(product)}>Xóa</button>
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
            {editProduct && (
                <div className={styles['update-modal']}>
                    <form onSubmit={handleUpdateProduct}>
                        <i className={`${styles['close-icon']} bi bi-x`} onClick={() => setEditProduct(null)}></i>
                        <div className={styles['form-group']}>
                            <label>ID</label>
                            <input type='text' name='id' value={editProduct.product_id} readOnly />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Hình ảnh</label>
                            <input type='text' name='image_url' value={editProduct.image_url} onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })} />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Tên sản phẩm</label>
                            <input type='text' name='name' value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Mô tả</label>
                            <textarea name='description' value={editProduct.description || ''} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}></textarea>
                        </div>
                        <div className={styles['form-group']}>
                            <label>Giá</label>
                            <input type='number' name='cost' value={editProduct.cost} onChange={(e) => setEditProduct({ ...editProduct, cost: +e.target.value })} />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Giá ưu đãi</label>
                            <input type='number' name='discount' value={editProduct.discount} onChange={(e) => setEditProduct({ ...editProduct, discount: +e.target.value })} />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Loại</label>
                            <select name='category_id' value={editProduct.category_id} onChange={(e) => setEditProduct({ ...editProduct, category_id: e.target.value })}>
                                {categoriesList.map((category) => (
                                    <option key={category.category_id} value={category.category_id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles['form-group']}>
                            <label>Số lượng</label>
                            <input type='number' name='quantity' value={editProduct.quantity} onChange={(e) => setEditProduct({ ...editProduct, quantity: +e.target.value })} />
                        </div>
                        <button type='submit'>Cập nhật</button>
                    </form>
                </div>
            )}
            {addProduct && (
                <div className={styles['add-product-modal']}>
                    <form onSubmit={handleAddProduct}>
                        <i className={`${styles['close-icon']} bi bi-x`} onClick={() => setAddProduct(null)}></i>
                        <div className={`${styles['form-group']} ${styles['mt16']}`}>
                        <input type='text' name='name' placeholder='Nhập tên sản phẩm' onChange={(e) => setAddProduct({ ...addProduct, name: e.target.value })} required />
                        </div>
                        <div className={styles['form-group']}>
                        <input type='text' name='image_url' placeholder='Nhập url hình ảnh' onChange={(e) => setAddProduct({ ...addProduct, image_url: e.target.value })} required />
                        </div>
                        <div className={styles['form-group']}>
                            <textarea name='description' placeholder='Mô tả' onChange={(e) => setAddProduct({ ...addProduct, description: e.target.value })}></textarea>
                        </div>
                        <div className={styles['form-group']}>
                            <input type='number' name='cost' placeholder='Giá' step={1000} onChange={(e) => setAddProduct({ ...addProduct, cost: +e.target.value })} required />
                        </div>
                        <div className={styles['form-group']}>
                            <input 
                                type='number' 
                                name='discount' 
                                placeholder='Giá ưu đãi' 
                                step={1000} onChange={(e) => setAddProduct({ ...addProduct, discount: +e.target.value })} 
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <select
                                id="category"
                                value={addProduct.category_id || ""}
                                onChange={(e) => setAddProduct({ ...addProduct, category_id: e.target.value })}
                                required
                            >
                                <option value="" disabled>Chọn loại sản phẩm</option>
                                {categoriesList.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles['form-group']}>
                            <input type='number' name='quantity' placeholder='Số lượng' onChange={(e) => setAddProduct({ ...addProduct, quantity: +e.target.value })} required />
                        </div>
                        <button type='submit' onClick={handleAddProduct}>Thêm sản phẩm</button>
                    </form>
                </div>
            )}
            {deleteProductModalOpen && (
                <div className={styles['delete-modal']}>
                    <div className={styles['delete-modal-content']}>
                        <h2>Xác nhận xóa sản phẩm</h2>
                        <p>Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"?</p>
                        <div className={styles['modal-actions']}>
                            <button className={styles['confirm-btn']} onClick={handleDeleteConfirm}>Xác nhận</button>
                            <button className={styles['cancel-btn']} onClick={() => setDeleteProductModalOpen(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsListManage;
