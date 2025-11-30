import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { deleteStudent, registerStudents, updateStudent } from '../controllers/studentsController.js'
import { getAllStudents } from '../controllers/studentsController.js'

const router = express.Router()

router.post('/register', protect, authorizeRoles('ADMIN'), registerStudents)
router.get('/class/:classId', protect, authorizeRoles('ADMIN'), getAllStudents)
router.put('/:studentId', protect, authorizeRoles('ADMIN'), updateStudent)
router.delete('/:studentId', protect, authorizeRoles('ADMIN'), deleteStudent)
export default router