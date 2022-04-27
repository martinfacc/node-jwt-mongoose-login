import dotenv from 'dotenv'
dotenv.config()

import { connectToMongo } from './mongo.js'
import express from 'express'
import cors from 'cors'
import logger from './logger.js'
import notFound from './middlewares/notFound.js'
import errorHandler from './middlewares/errorHandler.js'
import userRouter from './routes/user.js'

const { APP_PORT } = process.env
const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

app.get('/', (request, response) => {
	response.status(200).send('Hello World!')
})

app.use('/api/user', userRouter)
app.use(notFound)
app.use(errorHandler)

app.listen(APP_PORT, () => {
	console.log(`App listening on port ${APP_PORT}!`)
	connectToMongo()
})
