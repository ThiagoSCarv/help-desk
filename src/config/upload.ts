import crypto from 'node:crypto'
import path from 'node:path'
import multer from 'multer'

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp')
const UPLOADS_FOLDER = path.resolve(__dirname, '..', '..', 'tmp', 'uploads')
const MAX_SIZE = 3
const MAX_SIZE_FILE = 1024 * 1024 * MAX_SIZE
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const fileName = `${fileHash} - ${file.originalname}`
      return callback(null, fileName)
    },
  }),
}

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MAX_SIZE,
  MAX_SIZE_FILE,
  ACCEPTED_IMAGE_TYPES,
  MULTER,
}
