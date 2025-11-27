import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { deleteNotification, deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.get('/', protectRoute, getNotifications);
notificationRouter.delete('/', protectRoute, deleteNotifications);
notificationRouter.delete('/:id', protectRoute, deleteNotification);

export default notificationRouter;