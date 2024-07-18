import ConnectionDB from "../config/connectionDB.js";

class categoriesService {
    async getCategories() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT 
                        c.category_id, 
                        c.name, 
                        COUNT(p.product_id) AS product_count
                    FROM 
                        Categories c
                    LEFT JOIN 
                        Products p 
                    ON 
                        c.category_id = p.category_id
                    GROUP BY 
                        c.category_id, c.name;
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

    async addCategory(categoryData) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    INSERT INTO Categories (category_id, name)
                    VALUES ($1,$2);
                `;
                const values = [
                    categoryData.category_id, 
                    categoryData.name
                ];
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        })
    }

    async updateCategory() {

    }
}

const CategoriesService = new categoriesService();
export default CategoriesService;