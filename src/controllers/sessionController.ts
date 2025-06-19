import { authConfig } from '@/config/auth'
import { Role } from '@/generated/prisma'
import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import { compare } from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'
import { string } from 'zod/v4'

class SessionController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        email: z.string().email({ message: 'please use a valid e-mail' }),
        password: z
          .string()
          .min(6, { message: 'password must have at least 6 digits' }),
      })

      const { email, password } = bodySchema.parse(request.body)

      const user = await prisma.users.findFirst({ where: { email } })

      if (!user) {
        throw new AppError('invalid email or password', 401)
      }

      const hashedPassword = user.password

      const isValidPassword = await compare(password, hashedPassword)

      if (!isValidPassword) {
        throw new AppError('invalid email or password', 401)
      }

      const { SECRET, expiresIn } = authConfig.jwt

      const token = sign({ role: user.role }, SECRET, {
        expiresIn,
        subject: String(user.id),
      })

      return response.status(201).json({ token })
    } catch (error) {
      next(error)
    }
  }
}

export { SessionController }
