import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {authorizeRoles} from '../middleware/roleMiddleware.js';
import { assignFees, getFeesByTerm, getUnpaidFeeForStudent } from '../controllers/feeController.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('ADMIN'), getFeesByTerm);
router.get('/get-unpaid', protect, authorizeRoles('PARENT'), getUnpaidFeeForStudent)
router.post('/assign', protect, authorizeRoles('ADMIN'), assignFees);

export default router;