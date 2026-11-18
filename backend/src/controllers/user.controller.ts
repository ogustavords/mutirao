
import type { Request, Response } from 'express'

import {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deactivateUser,
} from '../services/user.service.js'

export async function createUserController(
  req: Request,
  res: Response
) {
  try {
    const { name, email, password } = req.body

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Informe nome, e-mail e senha.',
      })
    }

    if (!name.trim() || !email.trim() || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos os campos são obrigatórios.',
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'E-mail inválido.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'A senha deve ter pelo menos 8 caracteres.',
      })
    }

    const user = await createUser({ name, email, password })

    if (!user) {
      return res.status(409).json({
        status: 'error',
        message: 'Este e-mail já está cadastrado.',
      })
    }

    return res.status(201).json({
      status: 'ok',
      message: 'Usuário cadastrado com sucesso!',
      user,
    })
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível cadastrar o usuário.',
    })
  }
}

export async function listUsersController(
  req: Request,
  res: Response
) {
  try {
    const pageParam = req.query.page
    const limitParam = req.query.limit

    const page = pageParam === undefined ? 1 : Number(pageParam)
    const limit = limitParam === undefined ? 20 : Number(limitParam)

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Página ou limite inválido. O limite máximo é 100.',
      })
    }

    const result = await listUsers(page, limit)

    return res.status(200).json({
      status: 'ok',
      users: result.users,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar usuários:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível listar os usuários.',
    })
  }
}

export async function getUserByIdController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'ID inválido.',
      })
    }

    const user = await getUserById(id)

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.',
      })
    }

    return res.status(200).json({
      status: 'ok',
      user,
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível buscar o usuário.',
    })
  }
}

export async function updateUserController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'ID inválido.',
      })
    }

    const { name, email } = req.body

    if (name === undefined && email === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Informe pelo menos um campo para atualizar.',
      })
    }

    if (
      (name !== undefined && typeof name !== 'string') ||
      (email !== undefined && typeof email !== 'string')
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Nome e e-mail devem ser textos.',
      })
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'O nome não pode ficar vazio.',
      })
    }

    if (
      email !== undefined &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'E-mail inválido.',
      })
    }

    const user = await updateUser(id, { name, email })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.',
      })
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Usuário atualizado com sucesso!',
      user,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({
        status: 'error',
        message: 'Este e-mail já está cadastrado.',
      })
    }

    console.error('Erro ao atualizar usuário:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível atualizar o usuário.',
    })
  }
  
}

export async function deactivateUserController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'ID inválido.',
      })
    }

    const user = await deactivateUser(id)

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.',
      })
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Usuário desativado com sucesso!',
      user,
    })
  } catch (error) {
    console.error('Erro ao desativar usuário:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível desativar o usuário.',
    })
  }
}
