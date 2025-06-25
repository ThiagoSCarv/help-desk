import { ServicesController } from '@/controllers/servicesController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'

const servicesRoutes = Router()
const servicesController = new ServicesController()

servicesRoutes.use(ensureAuthenticated)
servicesRoutes.get('/', servicesController.index)

servicesRoutes.use(verifyUserAuthorization(['admin']))
servicesRoutes.post('/', servicesController.create)
servicesRoutes.put('/:id', servicesController.update)
servicesRoutes.delete('/:id', servicesController.remove)

export { servicesRoutes }
