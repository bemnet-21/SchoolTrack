import db from '../db/index.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
    const { name, password, email, role } = req.body
    try {
        const existingUser = await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        if(existingUser.rows.length > 0) {
            return res.status(400).json({ message : "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await db.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`, [name, email, hashedPassword, role ||"PARENT"])

        const user = result.rows[0]
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal Server Error" })
    }
}

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

        res.status(200).json({ 
            message: "Successfully logged in",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
         })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}