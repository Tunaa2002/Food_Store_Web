'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './foods.module.css';
import container from '@/common/styles/style.module.css';
import Product1 from '@/components/product1/product1';
import FilterOption from '@/components/filter-option/filterOption';
import ProductProps from '@/common/interfaces/productProps';
import Category from '@/common/interfaces/categories';
import { filterByCategories } from '@/common/utils/categoriesFilter';
import { filterByPriceRange } from '@/common/utils/priceFilter';

function Foods() {
    const [productData, setProductData] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [filteredProductData, setFilteredProductData] = useState<ProductProps[]>([]);

    const categoriesList: Category[] = [
        {categoryId: 'F01', name: 'Đồ ăn nhanh'},
        {categoryId: 'F02', name: 'Đồ ăn vặt'},
        {categoryId: 'F03', name: 'Đồ ăn nhẹ'},
        {categoryId: 'F04', name: 'Đồ ăn chính'},
        {categoryId: 'F05', name: 'Đồ ăn chay'},
    ];

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axios.get<ProductProps[]>('http://localhost:5000/foods');
                setProductData(response.data);
                setFilteredProductData(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedCategories, priceRange]);

    const applyFilters = () => {
        let filteredProducts = productData;

        filteredProducts = filterByCategories(filteredProducts, selectedCategories);
        filteredProducts = filterByPriceRange(filteredProducts, priceRange);

        setFilteredProductData(filteredProducts);
    };

    const handleCategoryChange = (selectedCategories: string[]) => {
        setSelectedCategories(selectedCategories);
    };

    const handlePriceChange = (priceRange: number[]) => {
        setPriceRange(priceRange);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className={styles['food-main']}>
            <div className={`${container['container']} ${styles['container']} ${container['clear-fix']}`}>
                <div className={styles['filter']}>
                    <FilterOption 
                        categories={categoriesList}
                        onCategoryChange={handleCategoryChange}
                        onPriceChange={handlePriceChange}
                    />
                </div>
                <div className={styles['food-content']}>
                    {filteredProductData.map((data) => (
                        <Product1
                            key={data.product_id}
                            image_url={data.image_url}
                            product_id={data.product_id}
                            name={data.name}
                            discount={data.discount}
                            cost={data.cost}
                            average_rating={data.average_rating || 0} 
                            orderNum={data.quantity}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Foods;
