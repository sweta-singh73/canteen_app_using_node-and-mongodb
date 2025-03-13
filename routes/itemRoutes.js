const express = require('express');
const { addItem, updateItem, deleteItem, getAllItemList } = require('../controllers/itemController');
const verifyToken = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/adminMiddleware');


const router = express.Router();

//routes
router.post("/add-item", verifyToken, adminMiddleware, addItem);
router.put("/update-item/:id", verifyToken, adminMiddleware, updateItem);
router.delete("/delete-item/:id", verifyToken, adminMiddleware, deleteItem);
router.get("/list-item", getAllItemList);



module.exports = router;
