import {Router} from 'express';
import { getPointAnalytics, getUserProfile, getMindStatus, saveFCMToken } from '../controllers/userController';


const router = Router();

router.get('/get/points/analytics', getPointAnalytics);
router.get('/get/profile', getUserProfile);
router.get('/get/mind_status', getMindStatus); 
router.post('/save/fcm_token', saveFCMToken); 

export default router;