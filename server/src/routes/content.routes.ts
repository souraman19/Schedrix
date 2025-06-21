import { getMotivationalVideos, getQuoteOfTheDay, getQuotes } from './../controllers/contentControllers';
import {Router} from 'express';

const router = Router();

router.get('/get/quotes', getQuotes);
router.get('/get/quote_of_the_day', getQuoteOfTheDay);

router.get('/get/motivational_videos', getMotivationalVideos);


export default router;