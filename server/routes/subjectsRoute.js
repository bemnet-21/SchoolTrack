import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { addSubject, getAllSubject, getSubject, updateSubject } from '../controllers/subjectsController.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('ADMIN'), addSubject)
// need to be tested for not found and check the relation between subject and teacher again
router.get('/', protect, getAllSubject)
router.get('/:subjectId', protect, authorizeRoles('ADMIN'), getSubject)
router.put('/:subjectId', protect, authorizeRoles('ADMIN'), updateSubject)
export default router