
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

interface LoginData {
  email: string
  password: string
}

export async function login(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email.trim().toLowerCase(),
    },
  })

  if (!user) {
    return null
  }

  if (user.status !== 'active') {
    return null
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.password_hash
  )

  if (!passwordMatches) {
    return null
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET não configurado.')
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: '1h',
    }
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    },
  }
}
