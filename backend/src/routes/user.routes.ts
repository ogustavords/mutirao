
import { Router } from 'express'

import {
  createUserController,
  listUsersController,
  getUserByIdController,
  updateUserController,
} from '../controllers/user.controller.js'

const router = Router()

router.get('/', listUsersController)
router.get('/:id', getUserByIdController)
router.post('/', createUserController)
router.patch('/:id', updateUserController)

export default router
