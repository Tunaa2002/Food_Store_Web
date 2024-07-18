import axios from 'axios';
import ProductProps from '@/common/interfaces/productProps';
import { filterByCategories } from '@/common/utils/categoriesFilter';
import { filterByPriceRange } from '@/common/utils/priceFilter';

const getProducts = async (selectedCategories: string[], priceRange: number[]): Promise<ProductProps[]> => {
    try {
        const response = await axios.get<ProductProps[]>('http://localhost:5000/products-list');
        let filteredProducts = response.data;
        filteredProducts = filterByCategories(filteredProducts, selectedCategories);
        filteredProducts = filterByPriceRange(filteredProducts, priceRange);
        return filteredProducts;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export default getProducts;
