import express from 'express';
import adminAuth from '../middlewares/adminAuth.js';
import {
    getPendingReports,
    claimReport,
    resolveReport
} from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/reports/pending', adminAuth, getPendingReports);

adminRouter.put('/reports/claim/:contentId', adminAuth, claimReport);
adminRouter.post('/reports/resolve/:reportId', adminAuth, resolveReport);

export default adminRouter;