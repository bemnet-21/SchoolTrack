import express from 'express'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { registerTeachers, getAllTeachers, deleteTeacher } from '../controllers/teachersController.js'

const router = express.Router()

router.post('/register', protect, authorizeRoles('ADMIN'), registerTeachers)
router.get('/', protect, authorizeRoles('ADMIN'), getAllTeachers)
router.delete('/:teacherId', protect, authorizeRoles('ADMIN'), deleteTeacher)
export default router