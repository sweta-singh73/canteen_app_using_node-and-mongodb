const express = require("express");
const { addMoney, getBalance } = require("../controllers/walletController");
const verifyToken = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/add-money", verifyToken, adminMiddleware, addMoney);
router.get("/balance", verifyToken, getBalance);

module.exports = router;
