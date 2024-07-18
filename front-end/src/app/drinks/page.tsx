'use client'

import React, { useEffect, useState } from 'react';
import styles from './drinks.module.css';
import container from '@/common/styles/style.module.css';
import Product1 from '@/components/product1/product1';
import FilterOption from '@/components/filter-option/filterOption';
import ProductProps from '@/common/interfaces/productProps';
import axios from 'axios';
import { filterByCategories } from '@/common/utils/categoriesFilter';
import { filterByPriceRange } from '@/common/utils/priceFilter';
import Category from '@/common/interfaces/categories';

function Drinks() {
    const [productData, setProductData] = useState<ProductProps[]>([]);
    const [filteredProductData, setFilteredProductData] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);

    const categoriesList: Category[] = [
        { category_id: 'D01', name: 'Nước ngọt' },
        { category_id: 'D02', name: 'Nước trái cây' },
        { category_id: 'D03', name: 'Sữa' },
        { category_id: 'D04', name: 'Trà sữa' },
        { category_id: 'D05', name: 'Đồ uống có cồn' },
        { category_id: 'D06', name: 'Nước khoáng' },
        { category_id: 'D07', name: 'Cà phê' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<ProductProps[]>('http://localhost:5000/drinks');
                setProductData(response.data);
                setFilteredProductData(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

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
                            average_rating={data.average_rating || 0}
                            quantity={data.quantity || 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Drinks;
