import ConnectionDB from "../config/connectionDB.js";

class productsListService {
    async getProductsList() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT p.product_id, p.image_url, p.name, p.category_id, p.description, p.cost, p.discount, c.name AS category_name, p.quantity
                    FROM Products p
                    JOIN Categories c ON p.category_id = c.category_id
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

    async updateProduct(product_id, productData) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const { name, image_url, category_id, description, cost, discount, quantity } = productData;
    
                const query = `
                    UPDATE Products
                    SET 
                        name = $1,
                        image_url = $2,
                        category_id = $3,
                        description = $4,
                        cost = $5,
                        discount = $6,
                        quantity = $7
                    WHERE product_id = $8
                    RETURNING *;
                `;
                const values = [name, image_url, category_id, description, cost, discount, quantity, product_id];
    
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally { 
                client.release();
            }
        });
    }

    async createProduct(productData) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    INSERT INTO Products (name, image_url, description, cost, discount, quantity, category_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;
    
                const values = [
                    productData.name,
                    productData.image_url,
                    productData.description || null,
                    productData.cost,
                    productData.discount,
                    productData.quantity,
                    productData.category_id,
                ];
    
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async deleteProduct(product_id) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    DELETE FROM Products
                    WHERE product_id = $1
                    RETURNING *;
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

const ProductsListService = new productsListService();
export default ProductsListService;