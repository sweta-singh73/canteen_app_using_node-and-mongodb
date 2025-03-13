const express = require('express');
const { addTodayMenu, getTodayMenu } = require('../controllers/todayMenuController');
const verifyToken = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

//routes

router.post("/add-todat-menus", verifyToken, adminMiddleware, addTodayMenu);
router.get("/today-menus-list", getTodayMenu);

module.exports = router;