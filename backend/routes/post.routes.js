import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post('/create', protectRoute, createPost);

export default postRouter;