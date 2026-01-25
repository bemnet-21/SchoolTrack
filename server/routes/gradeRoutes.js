import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { addGrade } from '../controllers/gradeController.js'


const router = express.Router()

router.post('/add-grade', protect, authorizeRoles('TEACHER'), addGrade)

export default router