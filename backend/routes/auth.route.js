import { Router } from 'express'
import { getuser, login, logout, signup } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protectRoute, getuser);
router.post('/logout', logout);


export default router;