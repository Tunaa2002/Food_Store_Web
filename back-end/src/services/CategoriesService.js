import ConnectionDB from "../config/connectionDB.js";

class categoriesService {
    async getCategories() {
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
            return result.rows;
        } catch (error) {
            console.error('Error in getCategories:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getCategoryById(category_id) {
        const pool = ConnectionDB.getPool();
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM Categories WHERE category_id = $1';
            const result = await client.query(query, [category_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error in getCategoryById:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async addCategory(categoryData) {
        const pool = ConnectionDB.getPool();
        const client = await pool.connect();
        try {
            const existingCategory = await this.getCategoryById(categoryData.category_id);
            if (existingCategory) {
                throw new Error('Category ID already exists.');
            }

            const query = `
                INSERT INTO Categories (category_id, name)
                VALUES ($1, $2)
                RETURNING *;
            `;
            const values = [categoryData.category_id, categoryData.name];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error in addCategory:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async updateCategory(category_id, name) {
        const pool = ConnectionDB.getPool();
        const client = await pool.connect();
        try {
            const query = `
                UPDATE Categories 
                SET name = $1 
                WHERE category_id = $2 
                RETURNING *;
            `;
            const values = [name, category_id];
            const result = await client.query(query, values);
            
            if (result.rowCount === 0) {
                throw new Error('Category not found');
            }
            
            return result.rows[0];
        } catch (error) {
            console.error('Error in updateCategory:', error);
            throw error;
        } finally {
            client.release();
        }
    }       

    async deleteCategory(category_id) {
        const pool = ConnectionDB.getPool();
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            await client.query('DELETE FROM Products WHERE category_id = $1', [category_id]);
            
            const result = await client.query('DELETE FROM Categories WHERE category_id = $1 RETURNING *', [category_id]);
            
            await client.query('COMMIT');
            
            if (result.rowCount === 0) {
                throw new Error('Category not found');
            }
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in deleteCategory:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

const CategoriesService = new categoriesService();
export default CategoriesService;
