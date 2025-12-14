import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { markAttendance } from '../controllers/attendanceController.js';

const router = express.Router()

router.post('/', protect, authorizeRoles('ADMIN', 'TEACHER'), markAttendance)

export default router;