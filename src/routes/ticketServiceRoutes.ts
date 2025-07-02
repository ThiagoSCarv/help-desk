import { TicketServiceController } from '@/controllers/ticketServiceController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const ticketServiceRoutes = Router()
const ticketServiceController = new TicketServiceController()

ticketServiceRoutes.use(ensureAuthenticated)
ticketServiceRoutes.post(
  '/',
  verifyUserAuthorization(['client', 'technician']),
  ticketServiceController.create
)
ticketServiceRoutes.get(
  '/:id',
  verifyUserAuthorization(['technician']),
  ticketServiceController.show
)
ticketServiceRoutes.delete(
  '/:id',
  verifyUserAuthorization(['technician']),
  ticketServiceController.remove
)

export { ticketServiceRoutes }
