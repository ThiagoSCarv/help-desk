import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { email } from 'zod/v4'

export class UsersControllers {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z
          .string()
          .min(3, { message: 'Name must have at least 3 letters' }),
        email: z.string().email(),
        password: z
          .string()
          .min(6, { message: 'Password must to have at least 6 digits' }),
      })

      const { name, email, password } = bodySchema.parse(request.body)

      response.status(201).json({ name, email, password })
      // biome-ignore lint/correctness/noUnreachable: <explanation>
    } catch (error) {
      next(error)
    }
  }
}
