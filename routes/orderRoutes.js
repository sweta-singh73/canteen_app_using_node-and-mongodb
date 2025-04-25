const express = require("express");
const verifyToken = require("../middlewares/auth");
const { placeOrder, statusUpdate, orderList, pendingOrder, viewOrder, listAllOrder, deleteOrder, completeOrder } = require("../controllers/orderController");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/place-order", verifyToken, placeOrder);
router.post("/status-update", verifyToken, adminMiddleware, statusUpdate);
router.get("/order-list", verifyToken, adminMiddleware, orderList);
router.get("/pending-order", verifyToken, adminMiddleware, pendingOrder);
router.get("/view-order/:id", verifyToken, viewOrder);
router.get("/list-all-order", verifyToken, listAllOrder);
router.delete("/delete-order", verifyToken, adminMiddleware, deleteOrder);
router.get("/completed-order", verifyToken, adminMiddleware, completeOrder);

module.exports = router;