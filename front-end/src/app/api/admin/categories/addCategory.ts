import axios from 'axios';
import Category from '@/common/interfaces/categories';

const addCategoryAPI = async (categoryData: Category): Promise<Category | null> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.post<Category>('http://localhost:5000/add-category', categoryData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            return null;
        }
    }
    return null; 
};

export default addCategoryAPI;
