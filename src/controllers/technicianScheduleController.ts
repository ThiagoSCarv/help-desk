import { dayjs } from '@/libs/dayjs'
import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { number } from 'zod/v4'

class TechnicianScheduleController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        technician: z.string().uuid(),
        availableHours: z
          .enum([
            'H07_00',
            'H08_00',
            'H09_00',
            'H10_00',
            'H11_00',
            'H12_00',
            'H13_00',
            'H14_00',
            'H15_00',
            'H16_00',
            'H17_00',
            'H18_00',
            'H19_00',
            'H20_00',
            'H21_00',
            'H22_00',
            'H23_00',
          ])
          .array(),
      })

      const { technician, availableHours } = bodySchema.parse(request.body)

      const isTechnician = await prisma.users.findFirst({
        where: { id: technician },
      })

      if (!isTechnician || isTechnician?.role !== 'technician') {
        throw new AppError('Técnico não encontrado')
      }

      await prisma.technicianSchedule.create({
        data: {
          technician: technician,
          availableHours,
        },
      })

      return response.status(201).json({ technician, availableHours })
    } catch (error) {
      next(error)
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const isTechnician = await prisma.users.findFirst({ where: { id } })

      if (!isTechnician || isTechnician?.role !== 'technician') {
        throw new AppError('Técnico não encontrado')
      }

      const technicianSchedule = await prisma.technicianSchedule.findMany({
        where: { technician: id },
        orderBy: { availableHours: 'asc' },
      })

      return response.json({ technicianSchedule })
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
        availableHours: z
          .enum([
            'H07_00',
            'H08_00',
            'H09_00',
            'H10_00',
            'H11_00',
            'H12_00',
            'H13_00',
            'H14_00',
            'H15_00',
            'H16_00',
            'H17_00',
            'H18_00',
            'H19_00',
            'H20_00',
            'H21_00',
            'H22_00',
            'H23_00',
          ])
          .array(),
      })

      const { availableHours } = bodySchema.parse(request.body)

      await prisma.technicianSchedule.update({
        data: { availableHours },
        where: { id: id },
      })

      return response.json({ availableHours })
    } catch (error) {
      next(error)
    }
  }
}

export { TechnicianScheduleController }
