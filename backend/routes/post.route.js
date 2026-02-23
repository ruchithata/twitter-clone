import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post('/create', protectRoute, createPost);
postRouter.post('/comment/:id', protectRoute, commentPost);
postRouter.post('/like/:id', protectRoute, likeUnlikePost);

postRouter.get('/likes/:id', protectRoute, getLikedPosts);
postRouter.get('/', protectRoute, getAllPosts);
postRouter.get('/following', protectRoute, getFollowingPosts);
postRouter.get('/user/:username', protectRoute, getUserPosts);

postRouter.delete('/:id', protectRoute, deletePost);


export default postRouter;