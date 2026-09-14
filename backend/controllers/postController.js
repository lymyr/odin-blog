import { prisma } from "../lib/prisma.js"
process.loadEnvFile()

export const getPublicPosts = async (req, res) => {
    const postAmount = 10

    const postsQuery = prisma.post.findMany({
        where: { isPublished: true },
        select: { 
            id: true, 
            title: true, 
            dateAdded: true, 
            comments: true,
            author: { select: { id: true, username:true } } 
        },
        orderBy: { dateAdded: "desc" },
        take: postAmount,
        skip: req.query.page > 1 ? (parseInt(req.query.page)-1)*postAmount : 0
    })
    const countQuery = prisma.post.count({ where: {isPublished: true }})
    const [posts, count] = await Promise.all([postsQuery, countQuery])
    
    res.json({ posts, maxPage: Math.ceil(count/10) })
}

export const getPosts = async (req, res) => {
    const postAmount = 10

    const postsQuery = prisma.post.findMany({
        orderBy: { dateAdded: "desc" },
        include: { comments: true },
        take: postAmount,
        skip: req.query.page > 1 ? (parseInt(req.query.page)-1)*postAmount : 0
    })
    const countQuery = prisma.post.count({ where: {isPublished: true }})
    const [posts, count] = await Promise.all([postsQuery, countQuery])

    res.json({ posts, maxPage: Math.ceil(count/10) })
}

export const addPost = async (req, res) => {
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

export const viewPostAdmin = async (req, res) => {
    const post = await prisma.post.findFirst({
        where: { id: req.params.postId },
        select: { 
            id: true,
            title: true, 
            dateAdded: true, 
            content: true,
            comments: { orderBy: { dateAdded: "desc" } },
            author: { select: { id: true, username:true } }
        }
    })
    res.json({post})
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