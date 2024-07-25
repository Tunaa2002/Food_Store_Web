import axios from "axios";
import RatingData from "@/common/interfaces/ratingData";

const getRatingAPI = async (product_id: number): Promise<RatingData[]> =>{
    const token = localStorage.getItem('user');
    if (token) {
        const { accessToken, expiry } = JSON.parse(token);

        if (new Date().getTime() >= expiry) {
            localStorage.removeItem('user');
            return [];
        }

        try {
            const response = await axios.get(`http://localhost:5000/get-rating/${product_id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching rating:', error);
            return [];
        }
    }
    return [];
};

export default getRatingAPI;
