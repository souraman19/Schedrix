import {Router} from 'express';
import { createTask, getFilteredTasks } from '../controllers/TaskControllers';

const router = Router();

router.post('/create', createTask);
router.post('/get/filtered', getFilteredTasks);


export default router;