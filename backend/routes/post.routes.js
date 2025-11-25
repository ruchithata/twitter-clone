import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost, deletePost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post('/create', protectRoute, createPost);
postRouter.delete('/:id', protectRoute, deletePost);

export default postRouter;