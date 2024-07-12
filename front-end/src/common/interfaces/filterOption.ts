import Category from "./categories";
export default interface FilterOptionProps {
    categories: Category[];
    onCategoryChange: (selectedCategories: string[]) => void;
    onPriceChange: (priceRange: number[]) => void;
}