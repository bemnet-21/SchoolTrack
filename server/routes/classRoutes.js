import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { assignTeacher, createClass, getClassDetails } from '../controllers/classController.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('ADMIN'), createClass)
router.get('/:classId', protect, getClassDetails)
router.put('/:classId', protect, authorizeRoles('ADMIN'), assignTeacher)
export default router