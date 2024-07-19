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
import getCategories from '../api/user/categories/getCategories';
import { getFoods } from '../api/user/products/getProducts';

function Foods() {
    const [productData, setProductData] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [filteredProductData, setFilteredProductData] = useState<ProductProps[]>([]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const foodsData = await getFoods()
                setProductData(foodsData);
                setFilteredProductData(foodsData);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await getCategories();
                const foodCategories = allCategories.filter(category => category.category_id.startsWith('F'));
                setCategoriesList(foodCategories);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchCategories();
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
                            description={data.description}
                            discount={data.discount}
                            cost={data.cost}
                            rate_avg={data.rate_avg || 0} 
                            quantity={data.quantity || 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Foods;
