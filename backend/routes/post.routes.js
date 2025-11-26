import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentPost, createPost, deletePost, likeUnlikePost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post('/create', protectRoute, createPost);
postRouter.delete('/:id', protectRoute, deletePost);
postRouter.post('/comment/:id', protectRoute, commentPost);
postRouter.post('/like/:id', protectRoute, likeUnlikePost);

export default postRouter;