import ProductProps from "../interfaces/productProps";
import Category from "../interfaces/categories";
import OrderData from "../interfaces/orderData";

// (chuyển tất cả ký tự thành chữ thường và loại bỏ dấu)
const normalizeString = (str: string) => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export const filterProductByName = (products: ProductProps[], searchText: string): ProductProps[] => {
    const normalizedSearchText = normalizeString(searchText);
    return products.filter(product =>
        normalizeString(product.name).includes(normalizedSearchText)
    );
};

export const filterCategoriesByName = (categories: Category[], searchText: string): Category[] => {
    const normalizedSearchText = normalizeString(searchText);
    return categories.filter(category =>
        normalizeString(category.name).includes(normalizedSearchText)
    );
};

export const filterOrderByName = (orders: OrderData[], searchText: string): OrderData[] => {
    const normalizedSearchText = normalizeString(searchText);
    return orders.filter(orders =>
        normalizeString(orders.username).includes(normalizedSearchText)
    );
};
