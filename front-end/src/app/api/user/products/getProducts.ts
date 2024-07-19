import axios from 'axios';
import ProductProps from '@/common/interfaces/productProps';

const API_URL = 'http://localhost:5000'

export const getProducts = async (): Promise<ProductProps[]> => {
    try {
        const response = await axios.get<ProductProps[]>(`${API_URL}/products-list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export const getFoods = async (): Promise<ProductProps[]> => {
    try {
        const response = await axios.get<ProductProps[]>(`${API_URL}/foods`);
        return response.data;
    } catch (error) {
        console.error('Error fetching foods:', error);
        throw error;
    }
};

export const getDrinks = async (): Promise<ProductProps[]> => {
    try {
        const response = await axios.get<ProductProps[]>(`${API_URL}/drinks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching drinks:', error);
        throw error;
    }
};


