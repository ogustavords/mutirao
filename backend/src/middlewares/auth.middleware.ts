
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        email: string
      }
    }
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token de autenticação não informado.',
      })
    }

    const token = authorization.slice(7)
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET não configurada.')
    }

    const decoded = jwt.verify(token, secret)

    if (
      typeof decoded === 'string' ||
      typeof decoded.userId !== 'number' ||
      typeof decoded.email !== 'string'
    ) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido.',
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        status: true,
      },
    })

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário inexistente ou inativo.',
      })
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    }

    return next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido ou expirado.',
      })
    }

    console.error('Erro na autenticação:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível validar a autenticação.',
    })
  }
}
