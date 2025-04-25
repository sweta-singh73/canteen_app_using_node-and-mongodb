const Employee = require("../models/employee");
const empValidationSchema = require("../helpers/validation");

// List All Users ***********************************************************
const userList = async (req, res) => {
  try {
    const users = await Employee.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// View User by Employee ID *************************************************
const viewUser = async (req, res) => {
  try {
    const { emp_id } = req.body;

    if (!emp_id) {
      return res.status(400).json({ error: "emp_id is required!" });
    }

    const employee = await Employee.findOne({ emp_id });

    if (!employee) {
      return res.status(404).json({ error: "Employee does not exist" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find Employee by Name ****************************************************
const getUserByName = async (req, res) => {
  try {
    // Validate request body using Joi schema
    const { error } = empValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { emp_id } = req.body;

    if (!emp_id) {
      return res.status(400).json({ error: "emp_id is required" });
    }

    const employee = await Employee.findOne({ emp_id });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found!" });
    }

    const payload = {
      emp_id: employee.emp_id,
      emp_name: employee.name,
    };

    res.status(200).json({
      message: "Employee fetched successfully",
      data: payload,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserByName, viewUser, userList };
