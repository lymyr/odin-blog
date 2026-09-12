import { validationResult } from "express-validator"
import { prisma } from "../lib/prisma.js"
process.loadEnvFile()

export const getPublicPosts = async (req, res) => {
    const postAmount = 10

    const posts = await prisma.post.findMany({
        where: { isPublished: true },
        select: { 
            id: true, 
            title: true, 
            dateAdded: true, 
            author: { select: { id: true, username:true } } 
        },
        orderBy: { dateAdded: "desc" },
        take: postAmount,
        skip: req.query.page > 1 ? (parseInt(req.query.page)-1)*postAmount : 0
    })

    res.json({ posts })
}

export const getPosts = async (req, res) => {
    const postAmount = 10

    const posts = await prisma.post.findMany({
        orderBy: { dateAdded: "desc" },
        take: postAmount,
        skip: req.query.page > 1 ? (parseInt(req.query.page)-1)*postAmount : 0
    })

    res.json({ posts })
}

export const addPost = async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty())
        return res.status(400).json(err.mapped())

    await prisma.post.create({
        data: {
            authorId: req.locals.user.id,
            title: req.body.title,
            content: req.body.content,
            isPublished: req.body.isPublished
        }
    })

    res.sendStatus(200)
}

export const viewPost = async (req, res) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: { isPublished: true, id: req.params.postId },
        select: { 
            title: true, 
            dateAdded: true, 
            content: true,
            comments: { orderBy: { dateAdded: "desc" } },
            author: { select: { id: true, username:true } }
        },
        orderBy: { dateAdded: "desc" },
    })

    res.json({ post })
}