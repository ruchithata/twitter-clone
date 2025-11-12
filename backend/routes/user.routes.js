import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserProfile } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/profile/:username', protectRoute, getUserProfile);

export default userRouter;