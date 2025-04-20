import {Router} from 'express';
import { createTask, getFilteredTasks, getTaskStaticDetails, getTaskDynamicDetails } from '../controllers/TaskControllers';

const router = Router();

router.post('/create', createTask);
router.post('/get/filtered', getFilteredTasks);
router.get('/get/static/details/:_id', getTaskStaticDetails);
router.get('/get/dynamic/details/:_id', getTaskDynamicDetails);


export default router;