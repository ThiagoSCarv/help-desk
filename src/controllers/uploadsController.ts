import uploadConfig from '@/config/upload'
import { DiskStorage } from '@/providers/disk-storage'
import { AppError } from '@/utils/appError'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { ZodError } from 'zod/v4'

class UploadsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const diskStorage = new DiskStorage()

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, { message: 'Arquivo é obrigarório' }),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              {
                message: `Formato de arquivo inválido. Formatos permitidos ${uploadConfig.ACCEPTED_IMAGE_TYPES}`,
              }
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_SIZE_FILE,
              `Arquivo excede o tamanho máximo de ${uploadConfig.MAX_SIZE}MB`
            ),
        })
        .passthrough()

      const file = fileSchema.parse(request.file)
      const filename = await diskStorage.saveFile(file.filename)

      response.json({ filename })
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, 'tmp')
        }

        throw new AppError(error.issues[0].message)
      }

      throw error
    }
  }
}

export { UploadsController }
