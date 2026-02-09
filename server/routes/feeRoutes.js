import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {authorizeRoles} from '../middleware/roleMiddleware.js';
import { assignFees, getFeeForChildren, getFeesByTerm, getUnpaidFeeForStudent } from '../controllers/feeController.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('ADMIN'), getFeesByTerm);
router.get('/get-unpaid', protect, authorizeRoles('PARENT'), getUnpaidFeeForStudent)
router.get('/get-fee-for-children', protect, authorizeRoles('PARENT'), getFeeForChildren)
router.post('/assign', protect, authorizeRoles('ADMIN'), assignFees);

export default router;