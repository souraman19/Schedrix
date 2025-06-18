import {Router} from 'express';
import { getPointAnalytics, getUserProfile, getMindStatus, saveFCMToken, editMindStatus, updateLastActiveDay, updateLastMindStatusAskData } from '../controllers/userController';


const router = Router();

router.get('/get/points/analytics', getPointAnalytics);
router.get('/get/profile', getUserProfile);
router.get('/get/mind_status', getMindStatus); 
router.post('/save/fcm_token', saveFCMToken); 
router.put('/edit/mind_status', editMindStatus); 
router.put('/update/user_last_active_day', updateLastActiveDay);
router.put('/update/user_last_mind_status_ask_data', updateLastMindStatusAskData);

export default router;