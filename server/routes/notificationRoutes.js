import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/get', userAuth, getUserNotifications);
router.put('/:notificationId/read', userAuth, markNotificationAsRead);

export default router;