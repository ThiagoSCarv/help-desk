import { TicketController } from '@/controllers/ticketController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const ticketRoutes = Router()
const ticketController = new TicketController()

ticketRoutes.use(ensureAuthenticated)
ticketRoutes.post(
  '/',
  verifyUserAuthorization(['admin', 'client']),
  ticketController.create
)
ticketRoutes.get(
  '/',
  ticketController.index
)
ticketRoutes.patch(
  '/:id',
  verifyUserAuthorization(['technician', 'admin']),
  ticketController.update
)
ticketRoutes.get('/:id', ticketController.show)

export { ticketRoutes }
