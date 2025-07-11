import { errorHandling } from '@/middlewares/errorHandling'
import cors from 'cors'
import express from 'express'
import { routes } from './routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(routes)

app.use(errorHandling)

export { app }
