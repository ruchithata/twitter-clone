import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.get('/', protectRoute, getAllPosts);
postRouter.get('/following', protectRoute, getFollowingPosts);
postRouter.get('/user/:username', protectRoute, getUserPosts);
postRouter.post('/create', protectRoute, createPost);
postRouter.delete('/:id', protectRoute, deletePost);
postRouter.post('/comment/:id', protectRoute, commentPost);
postRouter.post('/like/:id', protectRoute, likeUnlikePost);
postRouter.get('/likes/:id', protectRoute, getLikedPosts);

export default postRouter;