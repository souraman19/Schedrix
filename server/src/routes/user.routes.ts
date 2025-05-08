import {Router} from 'express';
import { getPointAnalytics, getUserProfile, getMindStatus } from '../controllers/userController';


const router = Router();

router.get('/get/points/analytics', getPointAnalytics);
router.get('/get/profile', getUserProfile);
router.get('/get/mind_status', getMindStatus); 

export default router;