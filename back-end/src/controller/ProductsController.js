import ProductsService from "../services/ProductsService.js";

class productsController {
    async getFoods(req, res) {
        try {
            const foodsList = await ProductsService.getFoods();
            if (!foodsList || foodsList.length === 0) {
                return res.status(404).json({ message: 'Products not found' });
            }
            res.json(foodsList);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getDrinks(req, res) {
        try {
            const drinksList = await ProductsService.getDrinks();
            if (!drinksList || drinksList.length === 0) {
                return res.status(404).json({ message: 'Products not found' });
            }
            res.json(drinksList);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProductDetail(req, res) {
        const { product_id } = req.params;
        try {
            const productDetails = await ProductsService.getProductDetail(product_id);

            if (productDetails) {
                res.json(productDetails);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const ProductsController = new productsController();
export default ProductsController;
