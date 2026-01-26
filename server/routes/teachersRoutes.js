import express from 'express'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { registerTeachers, getAllTeachers, deleteTeacher, updateTeacher, getTeacher, getClassForTeacher } from '../controllers/teachersController.js'

const router = express.Router()

router.get('/', protect, authorizeRoles('ADMIN'), getAllTeachers)
router.post('/register', protect, authorizeRoles('ADMIN'), registerTeachers)
router.get('/profile', protect, authorizeRoles('ADMIN', 'TEACHER'), getTeacher)
router.get('/get-class', protect, authorizeRoles('TEACHER'), getClassForTeacher)
router.delete('/:teacherId', protect, authorizeRoles('ADMIN'), deleteTeacher)
router.put('/:teacherId', protect, authorizeRoles('ADMIN'), updateTeacher)
router.get('/:teacherId', protect, authorizeRoles('ADMIN'), getTeacher)
export default router