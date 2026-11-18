
import { Router } from 'express'

import {
  createUserController,
  listUsersController,
  getUserByIdController,
  updateUserController,
  deactivateUserController,
} from '../controllers/user.controller.js'

import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = Router()

// rotas públicas
router.post('/', createUserController)

// rotas protegidas
router.get('/', authenticateToken, listUsersController)
router.get('/:id', authenticateToken, getUserByIdController)
router.patch('/:id', authenticateToken, updateUserController)
router.delete('/:id', authenticateToken, deactivateUserController)

export default router
