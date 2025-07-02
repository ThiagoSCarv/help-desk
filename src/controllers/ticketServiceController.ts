import { ok } from 'node:assert'
import { prisma } from '@/prisma'
import { AppError } from '@/utils/appError'
import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { uuid } from 'zod/v4'

class TicketServiceController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        ticket: z.string().uuid(),
        service: z.string().uuid(),
        addedBy: z.string().uuid(),
      })

      const { ticket, service, addedBy } = bodySchema.parse(request.body)

      const ticketFound = await prisma.ticket.findFirst({
        where: { id: ticket },
      })

      const serviceFound = await prisma.service.findFirst({
        where: {
          id: service,
        },
      })

      if (!serviceFound) {
        throw new AppError('Serviço não encontrado')
      }

      if (!ticketFound) {
        throw new AppError('Chamado não encontrado!')
      }

      if (ticketFound.status === 'closed') {
        throw new AppError('Este chamado já está encerrado')
      }

      if (
        ticketFound.technicianId !== addedBy &&
        ticketFound.clientId !== addedBy
      ) {
        throw new AppError('Esse chamado está atribuido a outra pessoa')
      }

      const priceOfService = serviceFound?.price

      const ticketService = await prisma.ticketService.create({
        data: {
          ticketId: ticket,
          serviceId: service,
          addedById: addedBy,
          price: priceOfService,
        },
      })

      return response.status(201).json(ticketService)
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

      const services = await prisma.ticketService.findMany({
        where: { ticketId: id },
      })

      return response.json(services)
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

      const service = await prisma.ticketService.findFirst({
        where: {
          id,
        },
      })

      if (!service) {
        throw new AppError('Serviço não encontrado')
      }

      const removeService = await prisma.ticketService.delete({ where: { id } })

      return response.json(removeService)
    } catch (error) {
      next(error)
    }
  }
}

export { TicketServiceController }
