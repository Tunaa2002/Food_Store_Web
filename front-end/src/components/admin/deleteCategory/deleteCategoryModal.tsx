import React from 'react';
import styles from './deleteCategory.module.css';
import Category from '@/common/interfaces/categories';

interface DeleteCategoryModalProps {
    category: Category;
    onClose: () => void;
    onDelete: (categoryId: string) => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ category, onClose, onDelete }) => {
    const handleDeleteClick = () => {
        onDelete(category.category_id);
        onClose();
    };

    return (
        <div className={styles['delete-category-modal']}>
            <div className={styles['modal-content']}>
                <span className={styles['close']} onClick={onClose}>&times;</span>
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa "{category.name}"?</p>
                <button className={styles['delete-btn']} onClick={handleDeleteClick}>Xác nhận</button>
                <button className={styles['cancel-btn']} onClick={onClose}>Hủy</button>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
