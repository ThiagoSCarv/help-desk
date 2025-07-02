import { Router } from 'express'
import { servicesRoutes } from './servicesRoutes'
import { sessionRoutes } from './sessionRoutes'
import { technicianScheduleRoutes } from './technicianScheduleRotes'
import { ticketRoutes } from './ticketRoutes'
import { ticketServiceRoutes } from './ticketServiceRoutes'
import { uploadsRoutes } from './uploadsRoutes'
import { usersRoutes } from './usersRoutes'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionRoutes)
routes.use('/uploads', uploadsRoutes)
routes.use('/technicianSchedule', technicianScheduleRoutes)
routes.use('/services', servicesRoutes)
routes.use('/tickets', ticketRoutes)
routes.use('/tickets/ticket-service', ticketServiceRoutes)
