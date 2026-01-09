import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getDashboardStats, getStudentPerformance } from '../controllers/dashboardController.js';

const router = express.Router();
router.get('/stats', protect, authorizeRoles('ADMIN'), getDashboardStats);
router.get('/performance', protect, authorizeRoles('ADMIN'), getStudentPerformance)

export default router;