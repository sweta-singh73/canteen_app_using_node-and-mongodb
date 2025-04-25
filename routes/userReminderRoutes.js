// routes/userReminderRoutes.js
const express = require("express");
const { fetchUserEveryMinute } = require("../controllers/reminderController");

const router = express.Router();
router.get("/list_emp_schedule", fetchUserEveryMinute);

module.exports = { employeeSchedulerRoute: router };
