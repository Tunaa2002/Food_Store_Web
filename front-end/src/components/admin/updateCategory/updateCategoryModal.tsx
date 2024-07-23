import React, { useState, useEffect } from 'react';
import styles from './updateCategory.module.css';
import Category from '@/common/interfaces/categories';

interface UpdateCategoryModalProps {
    category: Category;
    onClose: () => void;
    onUpdate: (categoryId: string, categoryName: string) => void;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({ category, onClose, onUpdate }) => {
    const [categoryName, setCategoryName] = useState(category.name);

    const handleUpdateClick = () => {
        onUpdate(category.category_id, categoryName);
        onClose();
    };

    return (
        <div className={styles['update-category-modal']}>
            <div className={styles['modal-content']}>
                <span className={styles['close']} onClick={onClose}>&times;</span>
                <h2>Cập nhật loại sản phẩm</h2>
                <div className={styles['form-group']}>
                    <label htmlFor="categoryId">Mã loại</label>
                    <input
                        type="text"
                        id="categoryId"
                        value={category.category_id}
                        readOnly
                    />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="categoryName">Tên loại</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>
                <button onClick={handleUpdateClick}>Xác nhận</button>
            </div>
        </div>
    );
};

export default UpdateCategoryModal;
