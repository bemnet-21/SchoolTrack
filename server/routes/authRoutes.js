import express from 'express'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { loginUser, registerUser } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', protect, authorizeRoles("ADMIN"), registerUser)

router.post('/login', loginUser)
export default router