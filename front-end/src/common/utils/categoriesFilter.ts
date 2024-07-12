
import ProductProps from "../interfaces/productProps";

export const filterByCategories = (products: ProductProps[], selectedCategories: string[]): ProductProps[] => {
    if (selectedCategories.length === 0) {
        return products;
    }

    return products.filter(product =>
        selectedCategories.includes(product.category_id)
    );
};
