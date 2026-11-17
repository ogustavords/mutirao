import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/health.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api/users', userRoutes)

export default app