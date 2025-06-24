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
        role: z.enum(["client", "technician", "admin"]).default('client').optional(),
      })

      const { name, email, password, role } = bodySchema.parse(request.body)

      const userWithSameEmail = await prisma.users.findFirst({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new AppError('User with same email already exists')
      }

      const hashedPassword = await hash(password, 8)

      const userWithoutPassword = await prisma.users.create({
        data: { name, email, password: hashedPassword, role },
      })

      return response.status(201).json(userWithoutPassword)
      // biome-ignore lint/correctness/noUnreachable: <explanation>
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await prisma.users.findMany()

      return response.json({ users })
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const bodySchema = z.object({
        name: z
          .string()
          .min(3, { message: 'Name must have at least 3 letters' }),
        email: z.string().email(),
        password: z
          .string()
          .min(6, { message: 'Password must to have at least 6 digits' })
          .optional(),
        newPassword: z
          .string()
          .min(6, { message: 'Password must to have at least 6 digits' })
          .optional(),
        avatarUrl: z.string().min(20).optional(),
      })

      const { name, email, password, newPassword, avatarUrl } =
        bodySchema.parse(request.body)

      const userWithSameEmail = await prisma.users.findFirst({
        where: { email },
      })

      const user = await prisma.users.findFirst({ where: { id } })

      if (!user) {
        throw new AppError('user not exists')
      }

      if (userWithSameEmail) {
        throw new AppError('User with same email already exists')
      }

      if (password && password !== newPassword) {
        throw new AppError('the passwords are different')
      }

      if (request.user?.role !== 'admin' && user?.id !== request.user?.id) {
        throw new AppError('unauthorized', 401)
      }

      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let hashedPassword

      if (password) {
        hashedPassword = await hash(password, 8)
      }

      await prisma.users.update({
        where: { id },
        data: { name, email, password: hashedPassword, avatarUrl },
      })

      return response.status(200).json({ name, email, hashedPassword })
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: 'Esse id não é valido' }),
      })

      const { id } = paramsSchema.parse(request.params)

      const user = await prisma.users.findFirst({ where: { id } })

      if (!user) {
        throw new AppError('Usuario não encontrado')
      }

      if (user.role === 'admin') {
        throw new AppError('Usuario não pode ser deletado')
      }

      await prisma.users.delete({ where: { id } })

      return response.status(200).json()
    } catch (error) {
      next(error)
    }
  }
}
