import express from 'express'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { registerTeachers, getAllTeachers, deleteTeacher, updateTeacher, getTeacher, getClassForTeacher, getTodaySchedule, getClassesForTeacher, getTeacherWeeklySchedule } from '../controllers/teachersController.js'

const router = express.Router()

router.get('/', protect, authorizeRoles('ADMIN'), getAllTeachers)
router.post('/register', protect, authorizeRoles('ADMIN'), registerTeachers)
router.delete('/delete/:teacherId', protect, authorizeRoles('ADMIN'), deleteTeacher)
router.put('/update/:teacherId', protect, authorizeRoles('ADMIN'), updateTeacher)
router.get('/profile/:teacherId', protect, authorizeRoles('ADMIN', 'TEACHER'), getTeacher)
router.get('/get-class', protect, authorizeRoles('TEACHER'), getClassForTeacher)
router.get('/get-classes', protect, authorizeRoles('TEACHER'), getClassesForTeacher)
router.get('/get-today-schedule', protect, authorizeRoles('TEACHER'), getTodaySchedule)
router.get('/get-weekly-schedule', protect, authorizeRoles('TEACHER'), getTeacherWeeklySchedule)
router.delete('/:teacherId', protect, authorizeRoles('ADMIN'), deleteTeacher)
router.put('/:teacherId', protect, authorizeRoles('ADMIN'), updateTeacher)
router.get('/:teacherId', protect, authorizeRoles('ADMIN'), getTeacher)
export default router