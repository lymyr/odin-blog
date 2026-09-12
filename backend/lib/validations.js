import { query, body, validationResult, param } from "express-validator"
import { prisma } from "./prisma.js"

const throwerHelper = (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty())
        return res.status(400).json(err.mapped())
    next()
}

class Validation {
    constructor() { throw new Error("Do not create new instance of static class") }
}

export class PostValidation extends Validation {
    static page = query("page").exists().withMessage("Please add a page query")
        .isInt({min: 1}).withMessage("Page query should be an integer greater than 0")
        .toInt()

    static post = [
        body("title").trim().exists({values: "falsy"}).withMessage("Please add a title")
            .isLength({min: 1, max: 50}).withMessage("Title should not exceed 50 characters"),
        body("content").trim().exists().withMessage("Please add content to your post")
            .isLength({min: 1, max: 255}).withMessage("Content should not exceed 255 characters")
    ]

    static postId = param("postId").trim().exists().withMessage("Please add a postId")
        .isInt().withMessage("postId should be an integer").bail().toInt()
        .custom(async (id, {req}) => {
            const post = await prisma.post.findFirst({ where: { id, isPublished: true } })
            if (!post)
                throw new Error("Post doesn't exist")
            if (!req.locals)
                req.locals = {}
            req.locals.post = post
        })

    static postIdMiddleware = [
        this.postId,
        throwerHelper
    ]

    static pageMiddleware = [
        this.page,
        throwerHelper
    ]

    static postMiddleware = [
        this.post,
        throwerHelper
    ]
}

export class adminValidation extends Validation {
    static login = [
        body("username").trim().notEmpty().withMessage("Please enter a username"),
        body("password").trim().notEmpty().withMessage("Please enter a password")
    ]
}