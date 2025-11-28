import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { registerStudents } from '../controllers/studentsController.js'

const router = express.Router()

router.post('/register', protect, authorizeRoles('ADMIN'), registerStudents)
export default router