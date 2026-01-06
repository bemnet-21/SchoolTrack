import express from 'express'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { loginUser, changePassword, getCurrentUser } from '../controllers/authController.js'

const router = express.Router()


router.post('/login', loginUser)
router.post('/change-password', protect, changePassword)
router.get('/me', protect, getCurrentUser)

export default router