
import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não foi carregada pelo servidor.')
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log('JWT_SECRET carregada:', Boolean(process.env.JWT_SECRET))
})
