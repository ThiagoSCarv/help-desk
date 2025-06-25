import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

class ServicesController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z
          .string()
          .min(3, { message: 'O nome precisa ter no minimo 3 letras' }),
        price: z.number().positive({ message: 'O valor precisa ser positivo' }),
      })

      const { name, price } = bodySchema.parse(request.body)

      const serviceAlreadyRegistered = await prisma.service.findFirst({
        where: { name },
      })

      if (serviceAlreadyRegistered) {
        throw new AppError('Esse serviço já foi cadastrado')
      }

      const service = await prisma.service.create({
        data: {
          name,
          price,
        },
      })

      return response.status(201).json({ service })
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const services = await prisma.service.findMany()

      return response.json(services)
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
          .min(3, { message: 'O nome precisa ter no minimo 3 letras' })
          .optional(),
        price: z
          .number()
          .positive({ message: 'O valor precisa ser positivo' })
          .optional(),
        isActive: z.boolean().optional(),
      })

      const { name, price, isActive } = bodySchema.parse(request.body)

      const service = await prisma.service.findFirst({ where: { id } })

      if (!service) {
        throw new AppError('Serviço não encontrado')
      }

      const serviceUpdate = await prisma.service.update({
        where: { id },
        data: { name, price, isActive },
      })

      return response.json({ serviceUpdate })
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const service = await prisma.service.findFirst({ where: { id } })

      if (!service) {
        throw new AppError('Serviço não encontrado')
      }

      const serviceDelete = await prisma.service.delete({ where: { id } })

      return response.json(serviceDelete)
    } catch (error) {
      next(error)
    }
  }
}

export { ServicesController }
