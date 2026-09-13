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
    // todo: remove and replace with throwerHelper
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

export const viewPost = (req, res) => {
    res.json({ post: req.locals.post })
}

export const updatePost = async (req, res) => {
    const post = await prisma.post.update({
        where: { id: req.locals.post.id },
        data: {
            title: req.body.title,
            content: req.body.content,
            isPublished: req.body.isPublished ? req.body.isPublished : false
        }
    })
    res.json({status: 200, post })
}

export const deletePost = async (req, res) => {
    const post = await prisma.post.delete({ where: {id: req.locals.post.id }})
    res.json({status: 200, post })
}