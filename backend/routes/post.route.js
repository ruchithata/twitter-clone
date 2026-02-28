import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost, favoriteUnfavoritePost, resharePost, getFavoritePosts, getResharedPosts } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post('/create', protectRoute, createPost);
postRouter.post('/comment/:id', protectRoute, commentPost);
postRouter.post('/like/:id', protectRoute, likeUnlikePost);
postRouter.post('/favorite/:id', protectRoute, favoriteUnfavoritePost);
postRouter.post('/reshare/:id', protectRoute, resharePost);

postRouter.get('/likes/:id', protectRoute, getLikedPosts);
postRouter.get('/favorites/:id', protectRoute, getFavoritePosts);
postRouter.get('/reshares/:id', protectRoute, getResharedPosts);
postRouter.get('/', protectRoute, getAllPosts);
postRouter.get('/following', protectRoute, getFollowingPosts);
postRouter.get('/user/:username', protectRoute, getUserPosts);

postRouter.delete('/:id', protectRoute, deletePost);


export default postRouter;