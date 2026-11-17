
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

interface CreateUserData {
  name: string
  email: string
  password: string
}

export async function createUser(data: CreateUserData) {
  const passwordHash = await bcrypt.hash(data.password, 12)

  try {
    return await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password_hash: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        created_at: true,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return null
    }

    throw error
  }
}
