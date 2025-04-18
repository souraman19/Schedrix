import { Router } from 'express';
import { googleAuth, googleAuthCallback, getUser } from '../controllers/AuthControllers';

const router = Router();


router.get('/google/callback', googleAuthCallback);
router.get("/google",  googleAuth)
router.get('/user', getUser);


export default router;