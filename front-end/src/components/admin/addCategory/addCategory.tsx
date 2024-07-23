import React, { useState } from 'react';
import styles from './addCategory.module.css';

interface AddCategoryModalProps {
    onClose: () => void;
    onAdd: (categoryId: string, categoryName: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAdd }) => {
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');

    const handleCategoryIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCategoryId(value);
        if (value.charAt(0) !== 'F' && value.charAt(0) !== 'D') {
            setError('Mã loại phải bắt đầu bằng ký tự "F" với đồ ăn hoặc "D" với đồ uống.');
        } else {
            setError('');
        }
    };

    const handleAddClick = () => {
        if (categoryId.charAt(0) !== 'F' && categoryId.charAt(0) !== 'D') {
            setError('Mã loại phải bắt đầu bằng ký tự "F" với đồ ăn hoặc "D" với đồ uống.');
            return;
        }
        setError('');
        onAdd(categoryId, categoryName);
        onClose();
    };

    return (
        <div className={styles['add-category-modal']}>
            <div className={styles['modal-content']}>
                <span className={styles['close']} onClick={onClose}>&times;</span>
                <h2>Thêm loại sản phẩm</h2>
                <div className={styles['form-group']}>
                    <input
                        type="text"
                        id="categoryId"
                        placeholder='Mã loại'
                        value={categoryId}
                        onChange={handleCategoryIdChange}
                    />
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="text"
                        id="categoryName"
                        placeholder='Tên loại'
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>
                {error && <p className={styles['error']}>{error}</p>}
                <button onClick={handleAddClick}>Xác nhận</button>
            </div>
        </div>
    );
};

export default AddCategoryModal;
