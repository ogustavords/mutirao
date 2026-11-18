
import type { Request, Response } from 'express'
import { login } from '../services/auth.service.js'

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Informe e-mail e senha.',
      })
    }

    const result = await login({ email, password })

    if (!result) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha inválidos, ou conta inativa.',
      })
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Login realizado com sucesso!',
      ...result,
    })
  } catch (error) {
    console.error('Erro no login:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Não foi possível realizar o login.',
    })
  }
}
