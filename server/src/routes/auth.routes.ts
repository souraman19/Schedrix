import { Router } from 'express';
import { googleAuth, googleAuthCallback, getUser } from '../controllers/AuthControllers';
import { isAuthenticated } from '../middlewares/AuthMiddleWires';

const router = Router();


router.get('/google/callback',  googleAuthCallback);
router.get("/google",  googleAuth)
router.get('/user', isAuthenticated, getUser);


export default router;