import ConnectionDB from "../config/connectionDB.js";

class productsService {
    async getFoods() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT *
                    FROM Products
                    WHERE CAST(category_id AS VARCHAR) LIKE 'F%';
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
                    SELECT *
                    FROM Products
                    WHERE CAST(category_id AS VARCHAR) LIKE 'D%';
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

    async productDetail(product_id) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                query = `
                    SELECT * FROM Products
                    WHERE product_id = $1;
                `;
                const values = [product_id];
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        })
    }

}

const ProductsService = new productsService();
export default ProductsService;