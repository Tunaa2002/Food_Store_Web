import ProductProps from "../interfaces/productProps";

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
