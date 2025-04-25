const express = require("express");
const {
  getUserByName,
  viewUser,
  userList,
  fetchUserEveryMinute,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();
//routes

router.get("/get-emp-name", verifyToken, adminMiddleware, getUserByName);
router.get("/view-employee", verifyToken, viewUser);
router.get("/list-user", verifyToken, adminMiddleware, userList);
module.exports = router;
