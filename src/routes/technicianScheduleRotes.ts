import { TechnicianScheduleController } from '@/controllers/technicianScheduleController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const technicianScheduleRoutes = Router()
const technicianScheduleController = new TechnicianScheduleController()

technicianScheduleRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(['admin'])
)
technicianScheduleRoutes.post('/', technicianScheduleController.create)
technicianScheduleRoutes.get('/:id', technicianScheduleController.show)
technicianScheduleRoutes.put('/:id', technicianScheduleController.update)

export { technicianScheduleRoutes }
