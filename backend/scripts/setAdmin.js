import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma.js"

let finMsg = "Finished "
console.log("Setting admin credentials...\n")
try {
    if (process.argv.length > 4)
        throw new Error("Please don't include spaces in username or password")

    const username = process.argv[2]
    const password = process.argv[3]

    if (username == null || password == null)
        throw new Error("Username/password can't be null")

    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.upsert({
        where: { id: 1 },
        update: { username, password: hashed },
        create: {
            id: 1,
            username,
            password: hashed
        }
    })
    
    finMsg += ":)"
} catch(e) {
    console.error(e)
    finMsg += ":("
}
console.log(finMsg)