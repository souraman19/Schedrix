import {Router} from 'express';
import { createTask, getFilteredTasks, getTaskStaticDetails, getTaskDynamicDetails, resolveTask } from '../controllers/TaskControllers';
import multer from 'multer';

const upload = multer();
const router = Router();

router.post('/create', createTask);
router.post('/get/filtered', getFilteredTasks);
router.get('/get/static/details/:_id', getTaskStaticDetails);
router.get('/get/dynamic/details/:_id', getTaskDynamicDetails);
router.post('/resolve/:_id', upload.none(), resolveTask);


export default router;