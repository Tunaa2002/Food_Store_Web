import axios from 'axios';

const deleteCategoryAPI = async (category_id: string): Promise<boolean> => {
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return false;
        }

        try {
            await axios.delete(`http://localhost:5000/delete-category/${category_id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            return false;
        }
    }
    return false;
};

export default deleteCategoryAPI;
