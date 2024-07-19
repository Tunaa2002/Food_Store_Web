import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchProfile = async (accessToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
    }
};

export const updateProfile = async (accessToken: string, updatedData: any) => {
    try {
        const response = await axios.put(`${API_URL}/update-profile`, updatedData, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
