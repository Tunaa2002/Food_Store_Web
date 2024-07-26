import ConnectionDB from '../config/connectionDB.js';

class cartService {
    async createCart(userId) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                INSERT INTO Carts (user_id)
                VALUES ($1)
                RETURNING *;
            `;
            const values = [userId];

            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async addCartItem(cartId, item) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                INSERT INTO CartItems (cart_id, product_id, quantity)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [cartId, item.product_id, item.quantity];

            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async updateCartItem(cartId, item) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                UPDATE CartItems
                SET quantity = $1
                WHERE cart_id = $2 AND product_id = $3
                RETURNING *;
            `;
            const values = [item.quantity, cartId, item.product_id];

            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async getCartItemsByCartId(cartId) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                SELECT ci.*, p.name, p.discount, p.image_url
                FROM CartItems ci
                JOIN Products p ON ci.product_id = p.product_id
                WHERE ci.cart_id = $1;
            `;
            // const query = `
            //     SELECT ci.*, p.name, p.discount, p.image_url, p.quantity as maxQuantity
            //     FROM CartItems ci
            //     JOIN Products p ON ci.product_id = p.product_id
            //     WHERE ci.cart_id = $1;
            // `;
            const values = [cartId];

            try {
                const result = await client.query(query, values);
                resolve(result.rows);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async getCartByUserId(userId) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                SELECT * FROM Carts WHERE user_id = $1;
            `;
            const values = [userId];

            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async removeCartItem(cartId, productId) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                DELETE FROM CartItems 
                WHERE cart_id = $1 AND product_id = $2 
                RETURNING *;
            `;
            const values = [cartId, productId];

            try {
                const result = await client.query(query, values);
                resolve(result.rows[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async updateCartItemQuantity(cartId, item) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();

            const query = `
                UPDATE CartItems
                SET quantity = $1
                WHERE cart_id = $2 AND product_id = $3
                RETURNING *;
            `;
            const values = [item.quantity, cartId, item.product_id];

            try {
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

const CartService = new cartService();
export default CartService;
