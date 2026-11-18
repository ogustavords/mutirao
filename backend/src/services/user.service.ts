
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

interface CreateUserData {
  name: string
  email: string
  password: string
}

interface UpdateUserData {
  name?: string
  email?: string
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

export async function listUsers(page: number, limit: number) {
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        created_at: true,
      },
    }),

    prisma.user.count(),
  ])

  return {
    users,
    total,
  }
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      created_at: true,
    },
  })
}

export async function updateUser(id: number, data: UpdateUserData) {
  try {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.email !== undefined && {
          email: data.email.trim().toLowerCase(),
        }),
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
      error.code === 'P2025'
    ) {
      return null
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }

    throw error
  }
}
