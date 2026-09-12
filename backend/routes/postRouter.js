import { Router } from "express";
import { addPost, getPublicPosts, viewPost } from "../controllers/postController.js";
import { PostValidation } from "../lib/validations.js";
import isAdmin from "../middleware/isAdmin.js";

const postRouter = Router()

postRouter.get('/', 
    PostValidation.pageMiddleware, 
    getPublicPosts
)

postRouter.post('/', 
    isAdmin, 
    PostValidation.postMiddleware, 
    addPost
)

postRouter.get('/:postId', 
    PostValidation.postIdMiddleware, 
    viewPost
)

postRouter.put('/:postId', 
    isAdmin, 
    PostValidation.postIdMiddleware
)

postRouter.delete('/:postId', 
    isAdmin, 
    PostValidation.postIdMiddleware
)

export default postRouter