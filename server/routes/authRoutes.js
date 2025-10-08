import express from 'express';
import {resetPassword, sendResetOtp, isAuthenticated, login, logout, register, verifyRegistration} from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register',register); 
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify-account',userAuth,verifyRegistration);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);

 
export default authRouter;