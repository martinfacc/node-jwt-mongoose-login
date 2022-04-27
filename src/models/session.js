import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId,
})

sessionSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

export default mongoose.model('Session', sessionSchema)
