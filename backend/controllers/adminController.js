import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"

process.loadEnvFile()

export const login = async (req, res) => {
    const admin = await prisma.user.findFirstOrThrow()
    const match = await bcrypt.compare(req.body.password, admin.password)

    if (!match)
        return res.json({
            password: { msg: "Incorrect password" }
        })


    delete admin.password
    const token = jwt.sign(admin, process.env.JWT_SECRET, {expiresIn: '1 day'})
    
    res.json({
        message: "Authenticated",
        token
    })
        
}
