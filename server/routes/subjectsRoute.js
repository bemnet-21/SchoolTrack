import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { addSubject, getSubject } from '../controllers/subjectsController.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('ADMIN'), addSubject)
router.get('/:subjectId', protect, authorizeRoles('ADMIN'), getSubject)

export default router