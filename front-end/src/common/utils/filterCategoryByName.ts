import Category from "../interfaces/categories";

const normalizeString = (str: string) => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

export const filterCategoriesByName = (categories: Category[], searchText: string): Category[] => {
    const normalizedSearchText = normalizeString(searchText);
    return categories.filter(category =>
        normalizeString(category.name).includes(normalizedSearchText)
    );
};