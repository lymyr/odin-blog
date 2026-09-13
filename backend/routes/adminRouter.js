import { Router } from "express"
import { login } from "../controllers/adminController.js"
import { adminValidation, validationThrowerHelper } from "../lib/validations.js"

const authRouter = Router()

authRouter.post('/', 
    adminValidation.login,
    validationThrowerHelper,
    login
)

export default authRouter