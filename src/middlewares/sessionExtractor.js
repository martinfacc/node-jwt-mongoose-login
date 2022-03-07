import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

const validateExpirationDate = (session) => {
  try {
    const dateNow = new Date()
  const expirationDate = session.expirationDate
  if (dateNow.getTime() < expirationDate.getTime()) return true
  }
  catch (error) {
    console.log(error)
  }
}

const authenticateSession = async (id, userId) => {
  try {
    const user = await User.findOne({ _id: userId }).populate('sessions')

    const session = user.sessions.find(session => session._id === id)
    if (!session) throw new Error('Authentication failed')

    const sessionIsExpired = !validateExpirationDate(session)
    if (sessionIsExpired) throw new Error('Authentication failed')
    
    return true
  } catch {}
}

const sessionExtractor = async (request, response, next) => {
  try {
    const header = request.get('authorization')
    if (!header || !header.startsWith('Bearer')) throw new Error('Unauthorized')
    const token = header.slice(7, header.length)
    const { id, user: userId } = jwt.verify(token, JWT_SECRET)
    if (!token || !id || !userId) throw new Error('Unauthorized')
    const isValid = await authenticateSession(id, userId)
    if (!isValid) throw new Error('Unauthorized')
    next()
  } catch (error) {
    next(error)
  }
}

export default sessionExtractor