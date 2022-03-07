import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expirationDate: {
    type: Date,
    default: new Date(Date.now() + 24*60*60*1000)
  }
  createdAt: {
    type: Date,
    default: new Date()
  }
})

sessionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const SessionModel = mongoose.model('Session', sessionSchema)

export default SessionModel
