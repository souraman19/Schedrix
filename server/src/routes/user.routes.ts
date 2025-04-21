import {Router} from 'express';
import { getPointAnalytics } from '../controllers/userController';


const router = Router();

router.get('/get/points/analytics', getPointAnalytics);

export default router;