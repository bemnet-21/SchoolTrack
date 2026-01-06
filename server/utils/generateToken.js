import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES

export const generateToken = (user) => {
    const payload = {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
    }
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    )
}