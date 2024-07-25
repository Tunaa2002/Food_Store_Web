import RatingService from "../services/ratingService.js";

class ratingController {
    async createRating(req, res) {
        const ratingData = req.body;
        try {
            const newRating = await RatingService.createRating(ratingData);
            res.status(201).json(newRating);
        } catch (err) {
            res.status(500).json({ message: "Failed to create rating", error: err.message });
        }
    }

    async getRating(req, res) {
        const { product_id } = req.params;
        try {
            const ratings = await RatingService.getRating(product_id);
            res.status(200).json(ratings);
        } catch (err) {
            res.status(500).json({ message: "Failed to get ratings", error: err.message });
        }
    }
}

const RatingController = new ratingController();
export default RatingController;
