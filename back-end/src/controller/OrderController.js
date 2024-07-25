import OrderService from "../services/orderService.js";

class orderController {
    async createOrder(req, res) {
        const { address, phone, payment_id, cartItems, totalPrice } = req.body;
        const user_id = req.user.user_id;

        try {
            // check remaining product quantity
            const stockCheck = await OrderService.checkProductStock(cartItems);
            if (!stockCheck) {
                throw new Error('Insufficient stock for one or more products');
            }

            // create order if enough quantity
            const order = await OrderService.createOrder({ user_id, address, phone, payment_id, totalPrice });
            if (!order) {
                throw new Error('Failed to create order');
            }
            const order_id = order.order_id;

            // create order detail when create order success
            for (const item of cartItems) {
                const orderDetail = await OrderService.createOrderDetail({
                    order_id: order_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.discount * item.quantity
                });
                if (!orderDetail) {
                    throw new Error(`Failed to create order detail for product ID ${item.product_id}`);
                }
            }

            // update p.quantity after order success
            const stockUpdate = await OrderService.updateProductStock(cartItems);
            if (!stockUpdate) {
                throw new Error('Failed to update product stock');
            }

            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message || error });
        }
    }

    async getOrders(req, res) {
        try {
            const orders = await OrderService.getOrders();
            res.json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getOrderDetail(req, res) {
        const { order_id } = req.params;
        try {
            const orderDetails = await OrderService.getOrderDetail(order_id);
            res.json(orderDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateOrderStatus(req, res) {
        const { order_id } = req.params;
        const { status } = req.body;
        try {
            const updatedOrder = await OrderService.updateOrderStatus(order_id, status);
            res.json(updatedOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const OrderController = new orderController();
export default OrderController;
