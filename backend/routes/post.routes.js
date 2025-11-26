import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentPost, createPost, deletePost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post('/create', protectRoute, createPost);
postRouter.delete('/:id', protectRoute, deletePost);
postRouter.post('/comment/:id', protectRoute, commentPost);

export default postRouter;