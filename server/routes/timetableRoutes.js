import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { createTimeTable } from '../controllers/timetableController.js'

const router = express.Router()

router.post('/create-timetable', protect, authorizeRoles('ADMIN'), createTimeTable)

export default router