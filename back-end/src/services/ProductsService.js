import ConnectionDB from "../config/connectionDB.js";

class productsService {
    async getFoods() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT 
                        p.*, 
                        ROUND(COALESCE(AVG(r.rating), 0), 1) AS rate_avg
                    FROM Products p
                    LEFT JOIN Ratings r ON p.product_id = r.product_id
                    WHERE CAST(p.category_id AS VARCHAR) LIKE 'F%'
                    GROUP BY 
                        p.product_id, p.image_url, p.name, p.category_id, 
                        p.description, p.cost, p.discount, p.quantity
                `;
                const result = await client.query(query);
    
                resolve(result.rows);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async getDrinks() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT 
                        p.*, 
                        ROUND(COALESCE(AVG(r.rating), 0), 1) AS rate_avg
                    FROM Products p
                    LEFT JOIN Ratings r ON p.product_id = r.product_id
                    WHERE CAST(p.category_id AS VARCHAR) LIKE 'D%'
                    GROUP BY 
                        p.product_id, p.image_url, p.name, p.category_id, 
                        p.description, p.cost, p.discount, p.quantity
                `;
                const result = await client.query(query);
    
                resolve(result.rows);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async getProductDetail(product_id) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT 
                        p.*, 
                        ROUND(COALESCE(AVG(r.rating), 0), 1) AS rate_avg
                    FROM Products p
                    LEFT JOIN Ratings r ON p.product_id = r.product_id
                    WHERE p.product_id = $1
                    GROUP BY 
                        p.product_id, p.image_url, p.name, p.category_id, 
                        p.description, p.cost, p.discount, p.quantity
                `;
                const values = [product_id];
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

}

const ProductsService = new productsService();
export default ProductsService;
