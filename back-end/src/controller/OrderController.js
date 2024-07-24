import OrderService from "../services/OrderService.js";

class orderController {
    async createOrder(req, res) {
        const { address, phone, payment_id, cartItems, totalPrice } = req.body;
        const user_id = req.user.user_id;

        try {
            // Kiểm tra số lượng tồn kho của từng sản phẩm
            await OrderService.checkProductStock(cartItems);

            // Tạo đơn hàng
            const order = await OrderService.createOrder({ user_id, address, phone, payment_id, totalPrice });
            const order_id = order.order_id;

            // Tạo chi tiết đơn hàng
            for (const item of cartItems) {
                await OrderService.createOrderDetail({
                    order_id: order_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.discount * item.quantity
                });
            }

            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error });
        }
    }

    async getOrdersByUserId(req, res) {
        const user_id = req.user.user_id;

        try {
            const orders = await OrderService.getOrdersByUserId(user_id);
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
}

const OrderController = new orderController();
export default OrderController;
