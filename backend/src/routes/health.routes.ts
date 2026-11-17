
import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'API do Mutirão funcionando!',
  })
})

router.get('/db-health', async (_req, res) => {
  try {
    const result = await prisma.$queryRaw<
      { conectado: bigint }[]
    >`SELECT 1 AS conectado`

    res.json({
      status: 'ok',
      message: 'Conexão com o MySQL via Prisma funcionando!',
      database: result.map(row => ({
        conectado: Number(row.conectado),
      })),
    })
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error)

    res.status(500).json({
      status: 'error',
      message: 'Não foi possível conectar ao MySQL.',
    })
  }
})

export default router
