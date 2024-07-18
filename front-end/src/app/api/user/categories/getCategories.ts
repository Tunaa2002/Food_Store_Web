import axios from 'axios';
import Category from '@/common/interfaces/categories';

const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get('http://localhost:5000/categories-list');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export default getCategories;
