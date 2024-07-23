import CategoriesService from "../services/CategoriesService.js";

class categoriesController {
    async getCategories(req, res) {
        try {
            const categories = await CategoriesService.getCategories();
            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: 'Categories not found' });
            }
            res.json(categories);
        } catch (error) {
            console.error('Error in getCategories:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async addCategory(req, res) {
        const categoryData = req.body;
        try {
            const newCategory = await CategoriesService.addCategory(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            if (error.message === 'Category ID already exists.') {
                res.status(400).json({ message: error.message });
            } else {
                console.error('Error in addCategory:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async updateCategory(req, res) {
        const { category_id } = req.params;
        const { name } = req.body;
        try {
            if (!category_id || !name) {
                return res.status(400).json({ message: 'Category ID and name are required' });
            }
    
            const updatedCategory = await CategoriesService.updateCategory(category_id, name);
            res.json({ message: 'Category updated successfully', updatedCategory });
        } catch (error) {
            if (error.message === 'Category not found') {
                res.status(404).json({ message: error.message });
            } else {
                console.error('Error in updateCategory:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
    

    async deleteCategory(req, res) {
        const { category_id } = req.params;
        try {
            const deletedCategory = await CategoriesService.deleteCategory(category_id);
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully', deletedCategory });
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const CategoriesController = new categoriesController();
export default CategoriesController;
