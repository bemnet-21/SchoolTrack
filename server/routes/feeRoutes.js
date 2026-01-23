import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {authorizeRoles} from '../middleware/roleMiddleware.js';
import { assignFees } from '../controllers/feeController.js';

const router = express.Router();

router.post('/assign', protect, authorizeRoles('ADMIN'), assignFees);

export default router;