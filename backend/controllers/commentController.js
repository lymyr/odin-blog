import { prisma } from "../lib/prisma.js"

export const addComment = async (req, res) => {
    const newComment = await prisma.comment.create({
        data: {
            postId: req.locals.post.id,
            username: req.body.username ? req.body.username : undefined,
            comment: req.body.comment,
        }
    })
    res.status(201).json({comment: newComment, status: 201})
}

export const deleteComment = async (req, res) => {
    await prisma.comment.delete({ where: {id: req.params.commentId } })
    res.sendStatus(200)
}