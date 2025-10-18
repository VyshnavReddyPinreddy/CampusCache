import express from 'express';
import userAuth from "../middlewares/userAuth.js";
import  submitFeedback  from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/submit', userAuth, submitFeedback);

export default feedbackRouter;