import React, { useState } from 'react';
import styles from './updateProduct.module.css';
import Category from '@/common/interfaces/categories';
import ProductProps from '@/common/interfaces/productProps';
import updateProductAPI from '@/app/api/admin/products/updateProduct';

interface UpdateProductProps {
    product: ProductProps;
    categoriesList: Category[];
    onProductUpdated: (updatedProduct: ProductProps) => void;
    onClose: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product, categoriesList, onProductUpdated, onClose }) => {
    const [editProduct, setEditProduct] = useState<ProductProps>(product);

    const handleUpdateProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        if (editProduct) {
            if (!editProduct.product_id) {
                console.error('Product ID is missing in editProduct');
                return;
            }
            try {
                const updatedProduct = await updateProductAPI(editProduct.product_id, editProduct);
                if (updatedProduct) {
                    const category = categoriesList.find(cat => cat.category_id === updatedProduct.category_id);
                    if (category) {
                        updatedProduct.category_name = category.name;
                    }
                    onProductUpdated(updatedProduct);
                    console.log('Product updated:', updatedProduct);
                }
            } catch (error) {
                console.error('Failed to update product:', error);
            }
        } else {
            console.error('editProduct is null or undefined');
        }
    };

    return (
        <div className={styles['update-modal']}>
            <form onSubmit={handleUpdateProduct}>
                <i className={`${styles['close-icon']} bi bi-x`} onClick={onClose}></i>
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
    );
};

export default UpdateProduct;
