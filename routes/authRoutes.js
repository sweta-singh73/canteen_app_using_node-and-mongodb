const express = require("express");
const {
  createEmp,
  login,
  verifyOtp,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();

//routes
router.post("/create-employee",createEmp);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);


module.exports = router;
