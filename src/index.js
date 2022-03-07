import dotenv from 'dotenv'
dotenv.config()

import { connect } from './mongo.js'
import express from 'express'
import cors from 'cors'
import logger from './logger.js'
import notFound from './middlewares/notFound.js'
import errorHandler from './middlewares/errorHandler.js'
import userRouter from './routes/User.js'

const { APP_PORT } = process.env
const app = express()
connect()

app.use(express.json())
app.use(cors())
app.use(logger)

app.use('/api/user', userRouter)
app.use(notFound)
app.use(errorHandler)

app.listen(APP_PORT, () => {
	console.log(`RRHH app listening on port ${PORT}!`)
})
