import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { addSubject } from '../controllers/subjectsController.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('ADMIN'), addSubject)

export default router