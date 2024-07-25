import ProductsListService from "../services/productsListService.js";

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
    async updateProduct(req, res) {
        const product_id = req.params.product_id;
        const productData = req.body;

        try {
            const updatedProduct = await ProductsListService.updateProduct(product_id, productData);
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(updatedProduct); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createProduct(req, res) {
        const productData = req.body;
        try {
            const newProduct = await ProductsListService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteProduct(req, res) {
        const product_id = req.params.product_id;
        try {
            const deletedProduct = await ProductsListService.deleteProduct(product_id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted successfully', deletedProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    
}

const ProductsListController = new productsListController();
export default ProductsListController;