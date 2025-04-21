import {Router} from 'express';
import { getPointAnalytics, getUserProfile } from '../controllers/userController';


const router = Router();

router.get('/get/points/analytics', getPointAnalytics);
router.get('/get/profile', getUserProfile);

export default router;