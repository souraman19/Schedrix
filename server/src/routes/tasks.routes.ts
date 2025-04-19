import {Router} from 'express';
import { createTask } from '../controllers/TaskControllers';

const router = Router();

router.post('/create', createTask);


export default router;