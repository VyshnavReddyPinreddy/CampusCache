import express from 'express';
import { getUserNotifications, toggleNotificationReadStatus } from '../controllers/notificationController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/get', userAuth, getUserNotifications);
router.put('/:notificationId/toggle', userAuth, toggleNotificationReadStatus);

export default router;