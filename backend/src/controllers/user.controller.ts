import type { Request, Response } from 'express'
import { createUser } from '../services/user.service.js'

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