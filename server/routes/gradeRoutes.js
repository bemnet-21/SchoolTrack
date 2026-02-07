import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { addGrade, getGrade, getGradeForStudent } from '../controllers/gradeController.js'


const router = express.Router()

router.get('/get-grades', protect, authorizeRoles('ADMIN'), getGrade)
router.post('/add-grade', protect, authorizeRoles('TEACHER'), addGrade)
router.get('/student-get-grade', protect, authorizeRoles('STUDENT', 'PARENT'), getGradeForStudent)

export default router