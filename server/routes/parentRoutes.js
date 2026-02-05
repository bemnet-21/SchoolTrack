import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { getChildren } from '../controllers/parentController.js'


const router = express.Router()

router.get('/get-children', protect, authorizeRoles('PARENT'), getChildren)

export default router