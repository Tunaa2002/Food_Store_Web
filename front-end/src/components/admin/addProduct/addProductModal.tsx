import React, { useState } from 'react';
import styles from './addProduct.module.css';
import Category from '@/common/interfaces/categories';
import ProductProps from '@/common/interfaces/productProps';
import addProductAPI from '@/app/api/admin/products/addProduct';

interface AddProductProps {
    categoriesList: Category[];
    onProductAdded: (newProduct: ProductProps) => void;
    onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ categoriesList, onProductAdded, onClose }) => {
    const [addProduct, setAddProduct] = useState<ProductProps | null>(null);

    const handleAddProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        if (addProduct) {
            try {
                const newProduct = await addProductAPI(addProduct);
                if (newProduct) {
                    const category = categoriesList.find(cat => cat.category_id === newProduct.category_id);
                    if (category) {
                        newProduct.category_name = category.name;
                    }
                    onProductAdded(newProduct);
                    console.log('Product added:', newProduct);
                    setAddProduct(null);
                } else {
                    console.error('Failed to add product: API didn\'t return new product');
                }
            } catch (error) {
                console.error('Failed to add product:', error);
            }
        } else {
            console.error('Add product data is missing');
        }
    };

    return (
        <div className={styles['add-product-modal']}>
            <form onSubmit={handleAddProduct}>
                <i className={`${styles['close-icon']} bi bi-x`} onClick={onClose}></i>
                <div className={`${styles['form-group']} ${styles['mt16']}`}>
                    <input type='text' name='name' placeholder='Nhập tên sản phẩm' onChange={(e) => setAddProduct({ ...addProduct, name: e.target.value } as ProductProps)} required />
                </div>
                <div className={styles['form-group']}>
                    <input type='text' name='image_url' placeholder='Nhập url hình ảnh' onChange={(e) => setAddProduct({ ...addProduct, image_url: e.target.value } as ProductProps)} required />
                </div>
                <div className={styles['form-group']}>
                    <textarea name='description' placeholder='Mô tả' onChange={(e) => setAddProduct({ ...addProduct, description: e.target.value } as ProductProps)}></textarea>
                </div>
                <div className={styles['form-group']}>
                    <input type='number' name='cost' placeholder='Giá' step={1000} onChange={(e) => setAddProduct({ ...addProduct, cost: +e.target.value } as ProductProps)} required />
                </div>
                <div className={styles['form-group']}>
                    <input 
                        type='number' 
                        name='discount' 
                        placeholder='Giá ưu đãi' 
                        step={1000} onChange={(e) => setAddProduct({ ...addProduct, discount: +e.target.value } as ProductProps)} 
                    />
                </div>
                <div className={styles['form-group']}>
                    <select
                        id="category"
                        value={addProduct?.category_id || ""}
                        onChange={(e) => setAddProduct({ ...addProduct, category_id: e.target.value } as ProductProps)}
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
                    <input type='number' name='quantity' placeholder='Số lượng' onChange={(e) => setAddProduct({ ...addProduct, quantity: +e.target.value } as ProductProps)} required />
                </div>
                <button type='submit'>Thêm sản phẩm</button>
            </form>
        </div>
    );
};

export default AddProduct;
