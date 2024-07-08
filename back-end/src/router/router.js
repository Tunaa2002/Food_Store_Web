import express from 'express';
import AccountController from '../controller/AccountController.js';
import ProfileController from '../controller/ProfileController.js';
import ProductsListController from '../controller/ProductsListController.js';
import AuthenToken from '../middleware/authenToken.js';


const router = express.Router();

router.post('/sign-up', (req, res) => AccountController.SignUp(req, res));
router.post('/sign-in', (req, res) => AccountController.SignIn(req, res));
router.get('/profile', AuthenToken, (req, res) => ProfileController.getProfile(req, res));
router.put('/update-profile', AuthenToken, (req, res) => ProfileController.updateProfile(req, res));
router.get('/products-list', (req, res) => ProductsListController.getProductsList(req, res));

export default router;
