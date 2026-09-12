import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { adminValidation } from "../lib/validations.js"
import { validationResult } from "express-validator"
process.loadEnvFile()

export const login = [
    adminValidation.login,
    async (req, res) => {
        const err = validationResult(req)
        if (!err.isEmpty())
            return res.status(400).json(err.mapped())

        const admin = await prisma.user.findFirstOrThrow()
        const match = await bcrypt.compare(req.body.password, admin.password)

        if (!match)
            return res.json({
                password: { msg: "Incorrect password" }
            })


        delete admin.password
        const token = jwt.sign(admin, process.env.JWT_SECRET, {expiresIn: '0.5min'})
        
        res.json({
            message: "Authenticated",
            token
        })
            
    }
]