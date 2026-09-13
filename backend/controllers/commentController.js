import { prisma } from "../lib/prisma.js"

export const addComment = async (req, res) => {
    await prisma.comment.create({
        data: {
            postId: req.locals.post.id,
            username: req.body.username ? req.body.username : undefined,
            comment: req.body.comment,
        }
    })
    res.sendStatus(200)
}

export const deleteComment = async (req, res) => {
    await prisma.comment.delete({ where: {id: req.params.commentId } })
    res.sendStatus(200)
}