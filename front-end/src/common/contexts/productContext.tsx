// contexts/productContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import ProductProps from '@/common/interfaces/productProps';

const ProductContext = createContext<{
    products: ProductProps[];
    getProductById: (id: number) => ProductProps | undefined;
} | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<ProductProps[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/path-to-your-products.json');
            const data: ProductProps[] = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const getProductById = (id: number): ProductProps | undefined => {
        return products.find(product => product.product_id === id);
    };

    return (
        <ProductContext.Provider value={{ products, getProductById }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};
