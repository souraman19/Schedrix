"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contentControllers_1 = require("./../controllers/contentControllers");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/get/quotes', contentControllers_1.getQuotes);
router.get('/get/quote_of_the_day', contentControllers_1.getQuoteOfTheDay);
router.get('/get/motivational_videos', contentControllers_1.getMotivationalVideos);
exports.default = router;
