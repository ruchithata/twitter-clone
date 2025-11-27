import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { followOrUnfollow, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/profile/:username', protectRoute, getUserProfile);
userRouter.post('/follow/:id', protectRoute, followOrUnfollow);
userRouter.get('/suggested', protectRoute, getSuggestedUsers);
userRouter.put('/update', protectRoute, updateUser);

export default userRouter;