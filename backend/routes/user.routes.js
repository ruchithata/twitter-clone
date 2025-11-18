import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { followOrUnfollow, getSuggestedUsers, getUserProfile } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/profile/:username', protectRoute, getUserProfile);
userRouter.post('/follow/:id', protectRoute, followOrUnfollow);
userRouter.get('/suggested', protectRoute, getSuggestedUsers);

export default userRouter;