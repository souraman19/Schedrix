import { Router } from 'express';
import { googleAuth, googleAuthCallback, getUser, logout } from '../controllers/authControllers';
import { isAuthenticated } from '../middlewares/AuthMiddleWires';

const router = Router();


router.get('/google/callback',  googleAuthCallback);
router.get("/google",  googleAuth)
router.get('/user', isAuthenticated, getUser);
router.get('/logout', logout);


export default router;