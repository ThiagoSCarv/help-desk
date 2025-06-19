import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import { hash } from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

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

      const userWithSameEmail = await prisma.users.findFirst({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new AppError('User with same email already exists')
      }

      const hashedPassword = await hash(password, 8)

      const userWithoutPassword = await prisma.users.create({
        data: { name, email, password: hashedPassword },
      })

      return response.status(201).json(userWithoutPassword)
      // biome-ignore lint/correctness/noUnreachable: <explanation>
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json({ message: 'ok' })
    } catch (error) {
      next(error)
    }
  }
}
