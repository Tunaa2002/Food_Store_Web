import ProductProps from "../interfaces/productProps";

export const filterByPriceRange = (products: ProductProps[], priceRange: number[]): ProductProps[] => {
    const [minPrice, maxPrice] = priceRange;
    return products.filter(product =>
        product.discount >= minPrice && product.discount <= maxPrice
    );
};
