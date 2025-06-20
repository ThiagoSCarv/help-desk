import { errorHandling } from '@/middlewares/errorHandling'
import express from 'express'
import { routes } from './routes'

const app = express()
app.use(express.json())

app.use(routes)

app.use(errorHandling)

export { app }
