import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { deleteStudent, getParentChildren, getStudentProfile, registerStudents, updateStudent } from '../controllers/studentsController.js'
import { getAllStudents } from '../controllers/studentsController.js'

const router = express.Router()

router.post('/register', protect, authorizeRoles('ADMIN'), registerStudents)
router.get('/class/:classId', protect, authorizeRoles('ADMIN'), getAllStudents)
router.put('/:studentId', protect, authorizeRoles('ADMIN'), updateStudent)
router.delete('/:studentId', protect, authorizeRoles('ADMIN'), deleteStudent)
router.get('/profile/:studentId', protect, authorizeRoles('ADMIN', 'PARENT', 'STUDENT'), getStudentProfile)
router.get('/my-children', protect, authorizeRoles('PARENT'), getParentChildren)
export default router