import { query, body, validationResult, param } from "express-validator"
import { prisma } from "./prisma.js"

export const validationThrowerHelper = (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty())
        return res.status(400).json(err.mapped())
    next()
}

class Validation {
    constructor() { throw new Error("Do not create new instance of static class") }
}




export class PostValidation extends Validation {
    static postId = () => param("postId").trim().exists().withMessage("Please add a postId")
        .isInt().withMessage("postId should be an integer").bail().toInt()

    static page = query("page").exists().withMessage("Please add a page query")
        .isInt({min: 1}).withMessage("Page query should be an integer greater than 0")
        .toInt()

    static post = [
        body("title").trim().exists({values: "falsy"}).withMessage("Please add a title")
            .isLength({min: 1, max: 50}).withMessage("Title should not exceed 50 characters"),
        body("content").trim().exists().withMessage("Please add content to your post")
            .isLength({min: 1, max: 255}).withMessage("Content should not exceed 255 characters")
    ]
        
    static postIdPublic = this.postId().custom(async (id, {req}) => {
        const post = await prisma.post.findFirst({
            where: { id, isPublished: true },
            select: { 
                id: true,
                title: true, 
                dateAdded: true, 
                content: true,
                comments: { orderBy: { dateAdded: "desc" } },
                author: { select: { id: true, username:true } }
            }
        })
        if (!post)
            throw new Error("Post doesn't exist")
        if (!req.locals)
            req.locals = {}
        req.locals.post = post
    })

    // admin route
    // used for updating and deleting specific posts
    static postIdPrivate = this.postId().custom(async (id, {req}) => {
            const post = await prisma.post.findFirst({
                where: { id, authorId: req.locals.user.id },
                select: { 
                    id: true,
                    title: true, 
                    dateAdded: true, 
                    content: true,
                    author: { select: { id: true, username:true } }
                }
            })
            if (!post)
                throw new Error("Post doesn't exist")
            if (!req.locals)
                req.locals = {}
            req.locals.post = post
        })
}

export class adminValidation extends Validation {
    static login = [
        body("username").trim().notEmpty().withMessage("Please enter a username"),
        body("password").trim().notEmpty().withMessage("Please enter a password")
    ]
}


export class commentValidation extends Validation {
    static username = body("username").trim().isLength({ max: 20 }).withMessage("Username should not exceed 20 characters")
    static comment = body("comment").trim().notEmpty().withMessage("Please add a comment")
        .isLength({min: 1, max: 120 }).withMessage("Comment should not exceed 120 characters")

    static commentId = param("commentId").exists().withMessage("Please add a commentId param")
        .isInt().withMessage("commentId must be an integer").bail().toInt()
        .custom(async id => {
            const c = await prisma.comment.findFirst({ where: {id} })
            if (!c)
                throw new Error("Comment doesn't exist")
        })
}