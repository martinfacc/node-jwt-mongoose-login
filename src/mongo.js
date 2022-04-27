import mongoose from 'mongoose'

process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected through app termination')
		process.exit(0)
	})
})

export const connectToMongo = async () => {
	try {
		const {
			DB_HOST,
			DB_PORT,
			DB_DATABASE,
			DB_USERNAME,
			DB_PASSWORD
		} = process.env
		const URI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
		const response = await mongoose.connect(URI)
		if (!response) throw new Error('Error connecting to MongoDB')
		console.log('Connected to MongoDB')
	}
	catch (err) {
		console.error(err)
	}
}