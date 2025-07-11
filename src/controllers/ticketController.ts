import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import { HOUR_LABELS } from '@/utils/hourLabels'
import dayjs from 'dayjs'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { includes, number } from 'zod/v4'
import { id } from 'zod/v4/locales'

class TicketController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        clientId: z.string().uuid({ message: 'Insira um id válido' }),
        technicianId: z.string().uuid({ message: 'Insira um id válido' }),
        status: z.enum(['open', 'in_progress', 'closed']).default('open'),
      })

      const { clientId, technicianId, status } = bodySchema.parse(request.body)

      const technician = await prisma.technicianSchedule.findFirst({
        where: { technician: technicianId },
      })

      const technicianAlreadyInService = await prisma.ticket.findFirst({
        where: {
          technicianId,
          closedAt: null,
        },
      })

      const hoursNow = dayjs().hour().toLocaleString()

      const hoursByTechnician = technician?.availableHours.map((hours) => {
        const hourAndMinutes = HOUR_LABELS[hours]
        const [hour] = hourAndMinutes.split(':')
        return hour
      })

      if (
        !hoursByTechnician?.includes(hoursNow) ||
        technicianAlreadyInService
      ) {
        throw new AppError('Técnico não disponivel no momento')
      }

      const ticket = await prisma.ticket.create({
        data: { clientId, technicianId },
      })

      return response.status(201).json({ ticket })
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = request.user?.id

      const whereClause =
        request.user?.role === 'admin'
          ? undefined
          : {
              OR: [{ clientId: userId }, { technicianId: userId }],
            }

      const tickets = await prisma.ticket.findMany({
        where: whereClause,
        include: {
          services: { select: { price: true } },
        },
      })

      const enrichedTickets = tickets.map((ticket) => {
        const total = ticket.services.reduce(
          (sum, service) => sum + service.price,
          0
        )
        return {
          ...ticket,
          totalSpent: total,
        }
      })

      return response.json({
        tickets: enrichedTickets,
      })
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
        status: z
          .enum(['open', 'in_progress', 'closed'])
          .default('in_progress'),
      })

      const { status } = bodySchema.parse(request.body)

      const ticket = await prisma.ticket.findFirst({
        where: {
          id,
        },
      })

      if (ticket?.status === 'closed') {
        throw new AppError('Esse chamado já foi encerrado')
      }

      if (status === 'closed') {
        const ticketUpdate = await prisma.ticket.update({
          where: { id },
          data: { status, closedAt: new Date() },
        })
      }

      const ticketUpdate = await prisma.ticket.update({
        where: { id },
        data: { status },
      })

      return response.json({ ticketUpdate })
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

      const ticket = await prisma.ticket.findFirst({
        where: { id },
        include: {
          services: { select: { price: true } },
        },
      })

      if (!ticket) {
        throw new AppError('Chamado não encontrado')
      }

      const totalSpent = ticket.services.reduce(
        (sum, service) => sum + service.price,
        0
      )

      return response.json({
        ...ticket,
        totalSpent,
      })
    } catch (error) {
      next(error)
    }
  }
}

export { TicketController }
