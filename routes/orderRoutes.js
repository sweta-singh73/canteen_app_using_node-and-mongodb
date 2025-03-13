const express = require("express");
const verifyToken = require("../middlewares/auth");
const { placeOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/place-order", verifyToken, placeOrder);

module.exports = router;
