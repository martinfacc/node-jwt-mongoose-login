import Session from '../models/session.js'
import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

const authenticateSession = async (sessionId, userId) => {
	try {
		const session = await Session.find({ _id: sessionId, userId })
		if (!session) throw new Error()
	} catch {
		throw new Error('invalidSession')
	}
}

const sessionExtractor = async (request, response, next) => {
	try {
		const header = request.get('authorization')
		if (!header || !header.startsWith('Bearer')) throw new Error('noAuthenticationHeader')
		const token = header.slice(7, header.length)
		const { sessionId, userId } = jwt.verify(token, JWT_SECRET)
		if (!token || !sessionId || !userId) throw new Error('invalidAuthenticationToken')
		await authenticateSession(sessionId, userId)
		next()
	} catch (error) {
		next(error)
	}
}

export default sessionExtractor