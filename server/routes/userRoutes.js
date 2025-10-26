import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { getUserData,resetInvalidReports } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.post('/reset-invalid-reports',userAuth,resetInvalidReports);

export default userRouter;