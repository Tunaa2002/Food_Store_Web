import ConnectionDB from "../config/connectionDB.js";

class productsListService {
    async getProductsList() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                const query = `
                    SELECT p.product_id, p.name, p.description, p.cost, p.discount, c.name AS category_name, p.quantity
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
}

const ProductsListService = new productsListService();
export default ProductsListService;