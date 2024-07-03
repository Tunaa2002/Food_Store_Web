import express from 'express';
import AccountController from '../controller/AccountController.js';
import ProfileController from '../controller/ProfileController.js';
import AuthenToken from '../middleware/authenToken.js';


const router = express.Router();

router.post('/sign-up', (req, res) => AccountController.SignUp(req, res));
router.post('/sign-in', (req, res) => AccountController.SignIn(req, res));
router.get('/profile', AuthenToken, (req, res) => ProfileController.getProfile(req, res));

export default router;
