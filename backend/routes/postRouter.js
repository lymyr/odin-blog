import { Router } from "express";
import { addPost, deletePost, getPosts, getPublicPosts, updatePost, viewPost, viewPostAdmin } from "../controllers/postController.js";
import { PostValidation, validationThrowerHelper } from "../lib/validations.js";
import isAdmin from "../middleware/isAdmin.js";

const postRouter = Router()

postRouter.get('/', 
    PostValidation.page,
    validationThrowerHelper, 
    getPublicPosts
)

postRouter.get('/admin', 
    isAdmin,
    PostValidation.page,
    validationThrowerHelper, 
    getPosts,
)

postRouter.post('/', 
    isAdmin, 
    PostValidation.post, 
    validationThrowerHelper,
    addPost
)

postRouter.get('/:postId/public', 
    PostValidation.postIdPublic,
    validationThrowerHelper, 
    viewPost
)

postRouter.get('/:postId', 
    isAdmin,
    PostValidation.postId(),
    validationThrowerHelper, 
    viewPostAdmin
)

postRouter.put('/:postId', 
    isAdmin, 
    PostValidation.postIdPrivate,
    validationThrowerHelper,
    updatePost
)

postRouter.delete('/:postId', 
    isAdmin, 
    PostValidation.postIdPrivate,
    validationThrowerHelper,
    deletePost
)

export default postRouter