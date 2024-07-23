import axios from 'axios';
import Category from '@/common/interfaces/categories';

const updateCategoryAPI = async (category_id: string, name: string): Promise<Category | null> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return null;
        }

        try {
            const response = await axios.put<Category>(`http://localhost:5000/update-category/${category_id}`, { name }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            return null;
        }
    }
    return null; 
};

export default updateCategoryAPI;
