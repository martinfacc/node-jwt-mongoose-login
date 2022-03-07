import User from '../models/User.js'
import Session from '../models/Session.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const addNewSession = async (user) => {
  try {
    const session = new Session({ user: user._id })
    const savedSession = await session.save()
    user.sessions = user.sessions.concat(savedSession._id)
    await user.save()
    return savedSession
  } catch (error) {
    throw Error('Error creating new session')
  }
}

export const signup = async (request, response) => {
  try {
    const { firstname, lastname, email, password } = request.body
    const hashedPassword = await hashPassword(password)
    const user = new User({ firstname, lastname, email, password: hashedPassword })
    const savedUser = await user.save()
    const session = await addNewSession(savedUser)
    const token = jwt.sign(session.toJSON(), process.env.JWT_SECRET)
    response.status(200).send({ firstname, lastname, email, token })
  } catch (error) {
    response.status(400).send(error)
  }
}

export const login = async (request, response) => {
  try {
    const { email, password } = request.body
    const user = await User.findOne({ email })
    //if (!user) throw Error('Email or password incorrect')
    const isPasswordValid = await bcrypt.compare(password, user?.password)
    if (!isPasswordValid) throw Error('Email or password incorrect')
    const session = await addNewSession(user)
    const token = jwt.sign(session.toJSON(), process.env.JWT_SECRET)
    response.status(200).send({ email, token })
  } catch (error) {
    response.status(400).send(error)
  }
}

export const logout = async (request, response) => {
  try {
    const header = request.get('authorization')
    const token = header.slice(7, header.length)
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    await Session.deleteOne({ _id: id })
    response.status(200).end()
  } catch (error) {
    response.status(400).send(error)
  }
}
