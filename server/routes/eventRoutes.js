import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { addEvent, getEvents } from '../controllers/eventController.js';

const router = express.Router();
router.get('/', protect, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT'), getEvents);
router.post('/add-event', protect, authorizeRoles('ADMIN'), addEvent);

export default router;