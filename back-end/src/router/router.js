import express from 'express';
import AccountController from '../controller/AccountController.js';
import ProfileController from '../controller/ProfileController.js';
import ProductsListController from '../controller/ProductsListController.js';
import AuthenToken from '../middleware/authenToken.js';
import ProductsControler from '../controller/ProductsControler.js';
import verifyToken from '../middleware/VerifyToken.js';


const router = express.Router();

router.post('/sign-up', (req, res) => AccountController.SignUp(req, res));
router.post('/sign-in', (req, res) => AccountController.SignIn(req, res));
router.get('/profile', AuthenToken, (req, res) => ProfileController.getProfile(req, res));
router.put('/update-profile', AuthenToken, (req, res) => ProfileController.updateProfile(req, res));
router.get('/products-list', (req, res) => ProductsListController.getProductsList(req, res));

router.get('/foods',(req, res) => ProductsControler.getFoods(req, res));
router.get('/drinks',(req, res) => ProductsControler.getDrinks(req, res));

router.post('/verify-token', AuthenToken, (req, res) => AccountController.VerifyToken(req, res));

export default router;
