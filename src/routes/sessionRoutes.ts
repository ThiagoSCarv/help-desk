import { SessionController } from '@/controllers/sessionController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { Router } from 'express'

export const sessionRoutes = Router()
const sessionController = new SessionController()

sessionRoutes.post('/', sessionController.create)

