import express from 'express';
import {
    register,
    verifyRegistration,
    login,
    logout,
    isAuthenticated,
    sendResetOtp,
    resetPassword
} from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.js';

const authRouter = express.Router();

// New Registration Flow
authRouter.post('/register', register);
authRouter.post('/verify-registration', verifyRegistration);

// Standard Auth Routes
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);

// Password Reset Flow
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
 
export default authRouter;