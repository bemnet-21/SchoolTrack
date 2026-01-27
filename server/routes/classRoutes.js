import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { assignSubjectsToClass, assignTeacher, createClass, getAllClasses, getClassDetails, getClassId } from '../controllers/classController.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('ADMIN'), createClass)
router.get('/', protect, authorizeRoles('ADMIN'), getAllClasses)
router.get('/get-class-id', protect, authorizeRoles('ADMIN'), getClassId)
router.post('/assign-subjects', protect, authorizeRoles('ADMIN'), assignSubjectsToClass)
router.get('/:classId', protect, getClassDetails)
router.put('/:classId', protect, authorizeRoles('ADMIN'), assignTeacher)
export default router