const express = require('express');
const { addMenu, updateMenu, deleteMenu, menuList } = require('../controllers/menuController');
const verifyToken = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

//routes
router.post("/add-menu", verifyToken, adminMiddleware, addMenu);
router.put("/update-menu/:id", verifyToken, adminMiddleware, updateMenu);
router.delete("/delete-menu/:id", verifyToken, adminMiddleware, deleteMenu);
router.get("/menu-list", menuList);


module.exports = router