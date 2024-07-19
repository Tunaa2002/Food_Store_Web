'use client'

import React, { useEffect, useState } from 'react';
import styles from './drinks.module.css';
import container from '@/common/styles/style.module.css';
import Product1 from '@/components/product1/product1';
import FilterOption from '@/components/filter-option/filterOption';
import ProductProps from '@/common/interfaces/productProps';
import { filterByCategories } from '@/common/utils/categoriesFilter';
import { filterByPriceRange } from '@/common/utils/priceFilter';
import Category from '@/common/interfaces/categories';
import getCategories from '../api/user/categories/getCategories';
import { getDrinks } from '../api/user/products/getProducts';

function Drinks() {
    const [productData, setProductData] = useState<ProductProps[]>([]);
    const [filteredProductData, setFilteredProductData] = useState<ProductProps[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const drinksData = await getDrinks()
                setProductData(drinksData);
                setFilteredProductData(drinksData);
            } catch (err: any) {
                console.log(err);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await getCategories();
                const foodCategories = allCategories.filter(category => category.category_id.startsWith('D') || category.category_id.startsWith('D'));
                setCategoriesList(foodCategories);
            } catch (err: any) {
                console.log(err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedCategories, priceRange]);

    // filter
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

    return (
        <div className={styles['drink-main']}>
            <div className={`${container['container']} ${styles['container']}`}>
                <div className={styles['filter']}>
                    <FilterOption 
                        categories={categoriesList}
                        onCategoryChange={handleCategoryChange}
                        onPriceChange={handlePriceChange}
                    />
                </div>
                <div className={styles['drink-content']}>
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

export default Drinks;
