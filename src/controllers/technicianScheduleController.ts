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
        availableHours: z.string(),
      })

      const { technician, availableHours } = bodySchema.parse(request.body)

      const isTechnician = await prisma.users.findFirst({
        where: { id: technician },
      })

      const alreadySchedule = await prisma.technicianSchedule.findFirst({
        where: { availableHours },
      })

      if (!isTechnician || isTechnician?.role !== 'technician') {
        throw new AppError('Técnico não encontrado')
      }

      if (alreadySchedule) {
        throw new AppError('Horário de atendimento já está agendado')
      }

      const newSchedule = await prisma.technicianSchedule.create({
        data: {
          technician: technician,
          availableHours,
        },
      })

      return response.status(201).json({ technician, newSchedule })
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
        select: { availableHours: true, technician: false },
      })

      return response.json({ technicianSchedule })
    } catch (error) {
      next(error)
    }
  }
}

export { TechnicianScheduleController }
