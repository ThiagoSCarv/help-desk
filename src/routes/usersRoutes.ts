import { UsersControllers } from '@/controllers/usersController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

export const usersRoutes = Router()
const usersController = new UsersControllers()

usersRoutes.post('/', usersController.create)
usersRoutes.put(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin', 'technician', 'client']),
  usersController.update
)
