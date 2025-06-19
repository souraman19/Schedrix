import { getQuotes } from './../controllers/contentControllers';
import {Router} from 'express';

const router = Router();

router.get('/get/quotes', getQuotes);


export default router;