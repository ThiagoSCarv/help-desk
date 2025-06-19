import { authConfig } from '@/config/auth'
import { AppError } from '@/utils/appError'
import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
  role: string, 
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('invalid jwt token')
  }

  const [, token] = authHeader.split(' ')

  const { sub: user_id, role } = verify(token, authConfig.jwt.SECRET) as TokenPayload

  request.user = { id: String(user_id), role}

  next()
}
