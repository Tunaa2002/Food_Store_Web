'use client'

import React, { useState, useEffect } from 'react';
import styles from './filterOption.module.css';
import Slider from '@mui/material/Slider';
import FilterOptionProps from '@/common/interfaces/filterOption';


const FilterOption: React.FC<FilterOptionProps> = ({ categories, onCategoryChange, onPriceChange }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [minPrice, setMinPrice] = useState<string>('0');
    const [maxPrice, setMaxPrice] = useState<string>('1000000');

    useEffect(() => {
        onCategoryChange(selectedCategories);
    }, [selectedCategories, onCategoryChange]);

    useEffect(() => {
        onPriceChange(priceRange);
    }, [priceRange, onPriceChange]);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories(prevState =>
            prevState.includes(categoryId)
                ? prevState.filter(id => id !== categoryId)
                : [...prevState, categoryId]
        );
    };

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
        setMinPrice(String((newValue as number[])[0]));
        setMaxPrice(String((newValue as number[])[1]));
    };

    const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (Number(value) < 0) return;
        setMinPrice(value);
        setPriceRange([Number(value), priceRange[1]]);
    };

    const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (Number(value) < 0) return;
        setMaxPrice(value);
        setPriceRange([priceRange[0], Number(value)]);
    };

    return (
        <div className={styles['filter-main']}>
            <div className={styles['filter-container']}>
                <div className={styles['filter-section']}>
                    <h3>Lọc theo thể loại</h3>
                    {categories.map(({ categoryId, name }, index) => (
                        <div key={index} className={styles['filter-item']}>
                            <input
                                type="checkbox"
                                id={`category-${categoryId}`}
                                name={name}
                                value={categoryId}
                                checked={selectedCategories.includes(categoryId)}
                                onChange={() => handleCategoryChange(categoryId)}
                            />
                            <label htmlFor={`category-${categoryId}`}>{name}</label>
                        </div>
                    ))}
                </div>
                <div className={styles['filter-section']}>
                    <h3>Lọc theo giá</h3>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000000}
                        step={1000}
                    />
                    <div className={styles['price-range']}>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            className={styles['price-input']}
                        />
                        <span>đến</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            className={styles['price-input']}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterOption;