'use client'

import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './slider.module.css';

function Slider() {
    const sliderIMG = [
        '/slider/slider_1.png',
        '/slider/slider_2.png',
        '/slider/slider_3.png',
    ];
    const posterIMG = [
        '/poster/poster_1.png',
        '/poster/poster_2.png',
        '/poster/poster_3.png',
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderIMG.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, [sliderIMG.length]);

    const previousSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + sliderIMG.length) % sliderIMG.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderIMG.length);
    };

    return (
        <div className={styles['banner']}>
            <div className={styles['slider-main']}>
                <div className={styles['slider-container']} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {sliderIMG.map((image, index) => (
                        <div key={index} className={`${styles['slide']} ${index === currentSlide ? styles['active'] : ''}`}>
                            <img src={image} alt={`Slider ${index + 1}`} className={styles['slide-image']} />
                        </div>
                    ))}
                </div>
                <button className={styles['prev']} onClick={previousSlide}>
                    <i className="bi bi-chevron-compact-left"></i>
                </button>
                <button className={styles['next']} onClick={nextSlide}>
                    <i className="bi bi-chevron-compact-right"></i>
                </button>
            </div>
            <div className={styles['poster-main']}>
                <div className={styles['poster']}>
                    {posterIMG.map((image, index) => (
                        <div key={index} className={styles['post']}>
                            <img src={image} alt={`Poster ${index + 1}`} className={styles['poster-image']} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Slider;
