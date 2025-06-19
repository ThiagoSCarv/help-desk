import { env } from '@/env'
import { jwt } from 'zod/v4'

export const authConfig = {
  jwt: {
    SECRET: env.JWT_SECRET || 'default',
    expiresIn: '1d',
  },
}
