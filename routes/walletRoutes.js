const express = require("express");
const { addMoney, getBalance } = require("../controllers/walletController");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.post("/add-money", verifyToken, addMoney);
router.get("/balance", verifyToken, getBalance);

module.exports = router;
