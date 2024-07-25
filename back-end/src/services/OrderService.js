import ConnectionDB from '../config/connectionDB.js';
import { format, addHours } from 'date-fns';

class orderService {
    async getOrders() {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                SELECT o.order_id, u.username, o.total_price, o.status, o.created_at, o.updated_at, p.description AS payment_description, o.address, o.phone_number
                FROM Orders o
                JOIN Users u ON o.user_id = u.user_id
                JOIN Payments p ON o.payment_id = p.payment_id;
            `;
            try {
                const result = await client.query(query);

                result.rows.forEach(order => {
                    if (order.created_at) {
                        const createdAtWithTimezone = addHours(new Date(order.created_at), 7);
                        order.created_at = format(createdAtWithTimezone, 'dd-MM-yyyy');
                    }
                    if (order.updated_at) {
                        const updatedAtWithTimezone = addHours(new Date(order.updated_at), 7);
                        order.updated_at = format(updatedAtWithTimezone, 'dd-MM-yyyy');
                    }
                });

                resolve(result.rows);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async getOrderDetail(order_id) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                SELECT od.*, p.name, p.discount, p.image_url  
                FROM OrderDetails od
                JOIN Products p ON od.product_id = p.product_id
                WHERE od.order_id = $1;
            `;
            const values = [order_id];
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

    async createOrder(order) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                INSERT INTO Orders (user_id, total_price, address, status, phone_number, payment_id)
                VALUES ($1, $2, $3, 'pending', $4, $5)
                RETURNING *;
            `;
            const values = [order.user_id, order.totalPrice, order.address, order.phone, order.payment_id];
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

    async createOrderDetail(orderDetail) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                INSERT INTO OrderDetails (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const values = [orderDetail.order_id, orderDetail.product_id, orderDetail.quantity, orderDetail.price];
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

    async updateOrderStatus(order_id, status) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            const query = `
                UPDATE Orders
                SET status = $1, updated_at = NOW()
                WHERE order_id = $2
                RETURNING *;
            `;
            const values = [status, order_id];
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

    async checkProductStock(cartItems) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                for (const item of cartItems) {
                    const query = `
                        SELECT quantity FROM Products WHERE product_id = $1;
                    `;
                    const values = [item.product_id];
                    const result = await client.query(query, values);
                    const productQuantity = result.rows[0].quantity;
                    if (productQuantity < item.quantity) {
                        reject(`Product ID ${item.product_id} does not have enough stock`);
                        return;
                    }
                }
                resolve(true);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }

    async updateProductStock(cartItems) {
        return new Promise(async (resolve, reject) => {
            const pool = ConnectionDB.getPool();
            const client = await pool.connect();
            try {
                for (const item of cartItems) {
                    const query = `
                        UPDATE Products
                        SET quantity = quantity - $1
                        WHERE product_id = $2;
                    `;
                    const values = [item.quantity, item.product_id];
                    await client.query(query, values);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            } finally {
                client.release();
            }
        });
    }
}

const OrderService = new orderService();
export default OrderService;
