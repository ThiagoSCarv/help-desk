import { UsersControllers } from '@/controllers/usersController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

export const usersRoutes = Router()
const usersController = new UsersControllers()

usersRoutes.post('/', usersController.create)
usersRoutes.get(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  usersController.index
)
usersRoutes.put('/:id', ensureAuthenticated, usersController.update)
usersRoutes.delete(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  usersController.remove
)
