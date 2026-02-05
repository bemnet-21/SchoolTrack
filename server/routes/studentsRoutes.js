import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { deleteStudent, getAllStudentsPerClass, getStudentProfile, getTodaySchedule, registerStudents, updateStudent } from '../controllers/studentsController.js'
import { getAllStudents } from '../controllers/studentsController.js'

const router = express.Router()

router.get('/', protect, authorizeRoles('ADMIN'), getAllStudents)
router.post('/register', protect, authorizeRoles('ADMIN'), registerStudents)
router.get('/get-today-schedule', protect, authorizeRoles('STUDENT'), getTodaySchedule)
router.get('/class/:classId', protect, authorizeRoles('ADMIN', 'TEACHER'), getAllStudentsPerClass)
router.put('/:studentId', protect, authorizeRoles('ADMIN'), updateStudent)
router.delete('/:studentId', protect, authorizeRoles('ADMIN'), deleteStudent)
router.get('/profile/:studentId', protect, authorizeRoles('ADMIN', 'PARENT', 'STUDENT'), getStudentProfile)
export default router