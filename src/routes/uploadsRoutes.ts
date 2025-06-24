import uploadConfig from '@/config/upload'
import { UploadsController } from '@/controllers/uploadsController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization'
import { Router } from 'express'
import multer from 'multer'

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(['client', 'technician'])
)
uploadsRoutes.post('/', upload.single('file'), uploadsController.create)

export { uploadsRoutes }
