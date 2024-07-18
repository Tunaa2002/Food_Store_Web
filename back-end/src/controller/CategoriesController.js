import CategoriesService from "../services/CategoriesService.js";

class categoriesController {
    async getCategories(req, res) {
        try {
            const categories = await CategoriesService.getCategories();
            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: 'categories not found' });
            }
            res.json(categories); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async addCategory(req, res) {
        const categoryData = req.body;
        try {
            const newCategory = await CategoriesService.addCategory(categoryData);
            console.status(201).json(newCategory);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
}

const CategoriesController = new categoriesController();
export default CategoriesController;