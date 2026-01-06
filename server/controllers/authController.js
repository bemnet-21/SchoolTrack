import db from '../db/index.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js'


export const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        const user = result.rows[0]
        if(!user) {
            return res.status(404).json({ message: "No user was found" })
        }
        const valid = await bcrypt.compare(password, user.password)
        if(!valid) return res.status(400).json({ message: "Invalid Credentials" })
        const token = generateToken(user)

        if(user.must_change_password) {
            return res.status(200).json({
                message : "Password change required",
                requirePasswordChange: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            })
        }
        res.status(200).json({ 
            message: "Successfully logged in",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            }
         })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const changePassword = async (req, res) => {
    const { newPassword } = req.body
    const userId = req.user.id

    if(!newPassword) return res.status(400).json({ message : "New password is required" })

    
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.query(`UPDATE users SET password = $1, must_change_password = false WHERE id = $2`, [hashedPassword, userId])

        res.status(200).json({ message : "Password updated successfully. Please login again." })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}

export const getCurrentUser = async (req, res) => {
    const userId = req.user.id

    try {
        const result = await db.query(`SELECT id, email, role, name FROM users WHERE id = $1`, [userId])
        const user = result.rows[0]
        res.status(200).json({ user })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}