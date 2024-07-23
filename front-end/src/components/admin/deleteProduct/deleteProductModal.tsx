import React from 'react';
import styles from './deleteProduct.module.css';
import ProductProps from '@/common/interfaces/productProps';
import deleteProductAPI from '@/app/api/admin/products/deleteProduct';

interface DeleteProductProps {
    product: ProductProps;
    onProductDeleted: (productId: number) => void;
    onClose: () => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ product, onProductDeleted, onClose }) => {
    const handleDeleteConfirm = async (event: React.FormEvent) => {
        event.preventDefault();
        if (product.product_id) {
            try {
                const deletedProduct = await deleteProductAPI(product.product_id);
                if (deletedProduct) {
                    onProductDeleted(product.product_id);
                    console.log('Product deleted:', product.product_id);
                }
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    return (
        <div className={styles['delete-modal']}>
            <i className={`${styles['close-icon']} bi bi-x`} onClick={onClose}></i>
            <form onSubmit={handleDeleteConfirm}>
                <p>Bạn có chắc chắn muốn xoá sản phẩm này không?</p>
                <button type='submit'>Xác nhận</button>
                <button type='button' onClick={onClose}>Huỷ</button>
            </form>
        </div>
    );
};

export default DeleteProduct;
