"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskControllers_1 = require("../controllers/taskControllers");
const multerConfig_1 = __importDefault(require("./../middlewares/multerConfig"));
const router = (0, express_1.Router)();
router.post('/create', multerConfig_1.default.fields([
    { name: 'images', maxCount: 100 },
    { name: 'audio', maxCount: 1 },
]), taskControllers_1.createTask);
router.post('/get/filtered', taskControllers_1.getFilteredTasks);
router.get('/get/static/details/:_id', taskControllers_1.getTaskStaticDetails);
router.get('/get/dynamic/details/:_id', taskControllers_1.getTaskDynamicDetails);
router.get('/get/repeatInfo/:_id', taskControllers_1.getTaskRepeatInfo);
router.post('/resolve/:_id', multerConfig_1.default.none(), taskControllers_1.resolveTask);
router.get('/get/timings/:_id', taskControllers_1.getTaskTimings);
router.post('/reschedule/:_id', multerConfig_1.default.none(), taskControllers_1.rescheduleTask);
router.get('/get/7days/:day', taskControllers_1.fetch7DaysTasks);
router.post('/tasklists/reschedule', taskControllers_1.rescheduleTaskLists);
router.put('/edit/reminder_time', taskControllers_1.editReminderTime);
exports.default = router;
