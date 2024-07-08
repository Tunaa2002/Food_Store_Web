'use client'

import React, { useState } from 'react';
import styles from './filterOption.module.css';
import Slider from '@mui/material/Slider';
import FilterOptionProps from '@/common/interfaces/filterOption';

const FilterOption: React.FC<FilterOptionProps> = ({ categories }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
    const [minPrice, setMinPrice] = useState<string>('0');
    const [maxPrice, setMaxPrice] = useState<string>('1000000');

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prevState =>
            prevState.includes(category)
                ? prevState.filter(c => c !== category)
                : [...prevState, category]
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

    const handleFilterApply = () => {
        console.log('Selected Categories:', selectedCategories);
        console.log('Price Range:', priceRange);
    };

    return (
        <div className={styles['filter-main']}>
            <div className={styles['filter-container']}>
                <div className={styles['filter-section']}>
                    <h3>Lọc theo thể loại</h3>
                    {categories.map((category, index) => (
                        <div key={index} className={styles['filter-item']}>
                            <input
                                type="checkbox"
                                id={`category-${index}`}
                                name={category}
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <label htmlFor={`category-${index}`}>{category}</label>
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
                    <button className={styles['send-btn']} onClick={handleFilterApply}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
}

export default FilterOption;
