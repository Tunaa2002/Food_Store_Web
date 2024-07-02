import express from 'express';
import AccountController from '../controller/AccountController.js';

const router = express.Router();

router.post('/sign-up', (req, res) => AccountController.SignUp(req, res));
router.post('/sign-in', (req, res) => AccountController.SignIn(req, res));

export default router;
