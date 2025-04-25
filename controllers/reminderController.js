// controllers/reminderController.js

const Employee = require("../models/employee");

// Pure function - handles business logic
const fetchUsers = async () => {
  try {
    const employees = await Employee.find();
    console.log(
      ` user list (${employees.length}):`,
      employees.map((e) => e.name)
    );
    return employees;
  } catch (error) {
    console.error("Cron job error:", error.message);
    throw error;
  }
};

// Route handler
const fetchUserEveryMinute = async (req, res) => {
  try {
    const employees = await fetchUsers();
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchUserEveryMinute,  
};
