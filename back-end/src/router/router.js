import express from 'express';
import AccountController from '../controller/accountController.js';
import ProfileController from '../controller/profileController.js';
import ProductsListController from '../controller/productsListController.js';
import AuthenToken from '../middleware/authenToken.js';
import ProductsController from '../controller/productsController.js';
import VerifyAdmin from '../middleware/verifyAdmin.js';
import CategoriesController from '../controller/categoriesController.js';
import CartController from '../controller/cartController.js';
import OrderController from '../controller/OrderController.js';
import VNPAYController from '../controller/vnpayController.js';


const router = express.Router();

router.post('/sign-up', (req, res) => AccountController.SignUp(req, res));
router.post('/sign-in', (req, res) => AccountController.SignIn(req, res));
router.get('/products-list', (req, res) => ProductsListController.getProductsList(req, res));
router.get('/categories-list', (req, res) => CategoriesController.getCategories(req, res));

router.put('/update-product/:product_id', VerifyAdmin, (req, res) => ProductsListController.updateProduct(req, res));
router.post('/add-product',VerifyAdmin, (req, res) => ProductsListController.createProduct(req, res));
router.delete('/delete-product/:product_id', VerifyAdmin, (req, res) => ProductsListController.deleteProduct(req, res));
router.post('/add-category', VerifyAdmin, (req, res) => CategoriesController.addCategory(req, res));
router.delete('/delete-category/:category_id',VerifyAdmin,(req, res) => CategoriesController.deleteCategory(req, res));
router.put('/update-category/:category_id', VerifyAdmin, (req, res) => CategoriesController.updateCategory(req, res));
router.get('/orders-list', VerifyAdmin, (req, res) => OrderController.getOrders(req, res));
router.get('/order-detail/:order_id',VerifyAdmin, (req, res) => OrderController.getOrderDetail(req, res));
router.put('/update-order/:order_id',VerifyAdmin, (req, res) => OrderController.updateOrderStatus(req, res));


router.get('/foods',(req, res) => ProductsController.getFoods(req, res));
router.get('/drinks',(req, res) => ProductsController.getDrinks(req, res));
router.get('/product-detail/:product_id', (req, res) => ProductsController.getProductDetail(req, res));


router.get('/profile', AuthenToken, (req, res) => ProfileController.getProfile(req, res));
router.put('/update-profile', AuthenToken, (req, res) => ProfileController.updateProfile(req, res));
router.post('/verify-token', AuthenToken, (req, res) => AccountController.VerifyToken(req, res));
router.get('/current-cart', AuthenToken, (req, res) => CartController.getCurrentCart(req, res));
router.post('/merge-cart', AuthenToken, (req, res) => CartController.mergeCart(req, res));
router.post('/remove-cart-item', AuthenToken, (req, res) => CartController.removeCartItem(req, res));
router.post('/create-order', AuthenToken, (req, res) => OrderController.createOrder(req, res));
router.post('/create-payment-url', AuthenToken, (req, res) => VNPAYController.createPaymentUrl(req, res));
router.get('/payment-return', AuthenToken, (req, res) => VNPAYController.handlePaymentReturn(req, res));

export default router;
