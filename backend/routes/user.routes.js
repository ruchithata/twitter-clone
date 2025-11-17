import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { followOrUnfollow, getUserProfile } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/profile/:username', protectRoute, getUserProfile);
userRouter.post('/follow/:id', protectRoute, followOrUnfollow);

export default userRouter;