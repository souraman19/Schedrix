import {Router} from 'express';
import { createTask, getFilteredTasks, getTaskStaticDetails, getTaskDynamicDetails, resolveTask, getTaskRepeatInfo, getTaskTimings, rescheduleTask, fetch7DaysTasks, rescheduleTaskLists, editReminderTime } from '../controllers/TaskControllers';
import upload from "./../middlewares/multerConfig";

const router = Router();

router.post('/create', upload.fields([
    {name: 'images', maxCount: 100},
]), createTask);
router.post('/get/filtered', getFilteredTasks);
router.get('/get/static/details/:_id', getTaskStaticDetails);
router.get('/get/dynamic/details/:_id', getTaskDynamicDetails);
router.get('/get/repeatInfo/:_id', getTaskRepeatInfo); 
router.post('/resolve/:_id', upload.none(), resolveTask);
router.get('/get/timings/:_id', getTaskTimings);
router.post('/reschedule/:_id', upload.none(), rescheduleTask);
router.get('/get/7days/:day', fetch7DaysTasks);
router.post('/tasklists/reschedule', rescheduleTaskLists);
router.put('/edit/reminder_time', editReminderTime);


export default router;