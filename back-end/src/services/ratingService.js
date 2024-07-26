import ConnectionDB from "../config/connectionDB.js";

class ratingService {
    async createRating(ratingData) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                INSERT INTO Ratings (product_id, rating, comment)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [ratingData.product_id, ratingData.rating, ratingData.comment];
            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (err) {
                reject(err);
            } finally {
                client.release();
            }
        });
    }

    async getRating(product_id) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT * FROM Ratings
                    WHERE product_id = $1;
                `;
                const result = await client.query(query, [product_id]);
                const ratings = result.rows.map(row => ({
                    ...row,
                    rating: parseFloat(row.rating)
                }));
                resolve(ratings);
            } catch (err) {
                reject(err);
            } finally {
                client.release();
            }
        });
    }
}

const RatingService = new ratingService();
export default RatingService;
