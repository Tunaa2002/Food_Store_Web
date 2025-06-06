import CartService from "../services/cartService.js";

class cartController {
    async mergeCart(req, res) {
        const userId = req.user.user_id;
        const localCartItems = req.body.cartItems;

        try {
            let cart = await CartService.getCartByUserId(userId);

            if (!cart) {
                cart = await CartService.createCart(userId);
            }

            let cartItems = await CartService.getCartItemsByCartId(cart.cart_id);

            for (const item of localCartItems) {
                const existingItem = cartItems.find(ci => ci.product_id === item.product_id);
                if (existingItem) {
                    if (existingItem.quantity !== item.quantity) {
                        await CartService.updateCartItemQuantity(cart.cart_id, item);
                    }
                } else {
                    await CartService.addCartItem(cart.cart_id, item);
                }
            }

            res.json({ message: 'Cart synced successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCurrentCart(req, res) {
        const userId = req.user.user_id;

        try {
            let cart = await CartService.getCartByUserId(userId);

            if (!cart) {
                cart = await CartService.createCart(userId);
            }

            const cartItems = await CartService.getCartItemsByCartId(cart.cart_id);

            res.json({
                ...cart,
                cartItems
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCartItem(req, res) {
        const userId = req.user.user_id;
        const { productId } = req.body;

        try {
            let cart = await CartService.getCartByUserId(userId);

            if (cart) {
                await CartService.removeCartItem(cart.cart_id, productId);
                res.json({ message: 'Product removed successfully' });
            } else {
                res.status(404).json({ message: 'Cart not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


const CartController = new cartController();
export default CartController;
