import { getMotivationalVideos, getQuotes } from './../controllers/contentControllers';
import {Router} from 'express';

const router = Router();

router.get('/get/quotes', getQuotes);
router.get('/get/motivational_videos', getMotivationalVideos);


export default router;