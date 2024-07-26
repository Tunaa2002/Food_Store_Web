import axios from "axios";
import RatingData from "@/common/interfaces/ratingData";

const getRatingAPI = async (product_id: number): Promise<RatingData[]> =>{
    try {
        const response = await axios.get(`http://localhost:5000/get-rating/${product_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rating:', error);
        return [];
    }
};

export default getRatingAPI;
