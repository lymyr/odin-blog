import { Router } from "express";
import { addComment, deleteComment } from "../controllers/commentController.js";
import { commentValidation, PostValidation, validationThrowerHelper } from "../lib/validations.js";
import isAdmin from "../middleware/isAdmin.js";

const commentRouter = Router({mergeParams: true})

commentRouter.post('/', 
    PostValidation.postIdPublic,
    commentValidation.username,
    commentValidation.comment,
    validationThrowerHelper,
    addComment
)

commentRouter.delete('/:commentId',
    isAdmin,
    PostValidation.postId(),
    commentValidation.commentId,
    validationThrowerHelper,
    deleteComment
)

export default commentRouter