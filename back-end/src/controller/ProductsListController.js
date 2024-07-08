import ProductsListService from "../services/ProductsListService.js";

class productsListController {
    async getProductsList(req, res) {
        try {
            const productsList = await ProductsListService.getProductsList();
            if (!productsList || productsList.length === 0) {
                return res.status(404).json({ message: 'Products not found' });
            }
            res.json(productsList); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const ProductsListController = new productsListController();
export default ProductsListController;