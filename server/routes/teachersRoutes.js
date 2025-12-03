import express from 'express'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { registerTeachers } from '../controllers/teachersController.js'

const router = express.Router()

router.post('/register', protect, authorizeRoles('ADMIN'), registerTeachers)
export default router