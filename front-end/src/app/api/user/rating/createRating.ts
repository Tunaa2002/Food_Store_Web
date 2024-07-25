import axios from "axios";
import RatingData from "@/common/interfaces/ratingData";

const createRatingAPI = async (ratingData: RatingData) => {
  const token = localStorage.getItem('user');
  if (token) {
    const { accessToken, expiry } = JSON.parse(token);

    if (new Date().getTime() >= expiry) {
      localStorage.removeItem('user');
      return null;
    }

    try {
      const response = await axios.post('http://localhost:5000/create-rating', ratingData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating rating:', error);
      return null;
    }
  }
  return null;
};

export default createRatingAPI;
