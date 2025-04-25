// const Employee = require("../models/employee");
// const OTP = require("../models/otp");
// const { generateToken, generateOtp } = require("../helpers/authHelper");
// const { signupValidation, loginValidation } = require("../helpers/validation");

// // Create Employee ************************************************************************
// const createEmp = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = signupValidation.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const { emp_id, name, role, email, department } = value;

//     // Check if employee ID already exists
//     const employeeExist = await Employee.findOne({ emp_id });

//     if (employeeExist) {
//       return res.status(403).json({
//         error: "This emp ID already exists. Please choose another one.",
//       });
//     }

//     // Create new employee
//     const empData = new Employee({
//       emp_id,
//       name,
//       role,
//       email,
//       department,
//     });

//     const empDetails = await empData.save();

//     res.status(200).json({
//       message: "User created successfully",
//       data: empDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// // Login Employee ************************************************************************
// const login = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = loginValidation.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }
//     const { emp_id } = value;

//     // Check if Employee Exists
//     const employeeExist = await Employee.findOne({ emp_id: emp_id });

//     if (!employeeExist) {
//       return res
//         .status(404)
//         .json({ error: "This Employee ID does not exist!" });
//     }

//     // Generate OTP
//     let otp = generateOtp();
//     let otpDetails = {
//       otp,
//       emp_id: emp_id,
//       email_id: employeeExist.email,
//     };

//     console.log("OTP generated");

//     // Check if OTP already exists
//     const isOtpExist = await OTP.findOne({ emp_id: numericEmpId });

//     if (isOtpExist) {
//       await OTP.findByIdAndUpdate(isOtpExist._id, { otp });
//     } else {
//       await new OTP(otpDetails).save();
//     }

//     console.log(`OTP for emp_id ${numericEmpId}: ${otp}`);

//     return res.status(200).json({
//       statusCode: 200,
//       message: "OTP sent successfully.",
//       data: { emp_id: numericEmpId },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Verify OTP ***************************************************************************
// const verifyOtp = async (req, res) => {
//   try {
//     const { emp_id, otp } = req.body;

//     if (!emp_id || !otp) {
//       return res.status(400).json({ error: "emp_id and otp are required!" });
//     }

//     const otpDetails = await OTP.findOne({ emp_id });

//     if (!otpDetails) {
//       return res
//         .status(400)
//         .json({ error: "OTP not found. Please request a new OTP." });
//     }

//     if (otpDetails.otp !== otp) {
//       await OTP.findByIdAndUpdate(otpDetails._id, { $inc: { count: 1 } });

//       if (otpDetails.count >= 3) {
//         await OTP.findByIdAndDelete(otpDetails._id);
//         return res.status(400).json({
//           error: "Too many incorrect attempts. Please try again later.",
//         });
//       }

//       return res.status(400).json({ error: "Invalid OTP. Please try again!" });
//     }

//     await OTP.findByIdAndDelete(otpDetails._id);

//     // Fetch employee details to get the role
//     const employee = await Employee.findOne({ emp_id });

//     if (!employee) {
//       return res.status(400).json({ error: "Employee not found!" });
//     }

//     if (!employee.role) {
//       return res
//         .status(400)
//         .json({ error: "Role is not defined for this user" });
//     }

//     // Generate token with emp_id and role
//     const token = await generateToken(
//       employee._id,
//       employee.role,
//       employee.emp_id
//     );

//     res.status(200).json({
//       message: "Login successful",
//       data: token,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createEmp, login, verifyOtp };

const Employee = require("../models/employee");
const OTP = require("../models/otp");
const { generateToken, generateOtp } = require("../helpers/authHelper");
const { signupValidation, loginValidation } = require("../helpers/validation");

// Create Employee ************************************************************************
const createEmp = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = signupValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: "Validation failed: " + error.details[0].message });
    }

    const { emp_id, name, role, email, department } = value;

    // Check if employee ID already exists
    const employeeExist = await Employee.findOne({ emp_id });
    if (employeeExist) {
      return res.status(403).json({
        error: "This emp ID already exists. Please choose another one.",
      });
    }

    // Create new employee
    const empData = new Employee({ emp_id, name, role, email, department });
    const empDetails = await empData.save();

    res.status(200).json({
      message: "User created successfully",
      data: empDetails,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Login Employee ************************************************************************
const login = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: "ID must be a number." });
    }

    const emp_id = parseInt(value.emp_id, 10); // Ensure emp_id is numeric
    if (isNaN(emp_id)) {
      return res.status(400).json({ error: "ID must be a number." });
    }

    // Check if Employee Exists
    const employeeExist = await Employee.findOne({ emp_id });
    if (!employeeExist) {
      return res
        .status(404)
        .json({ error: "This Employee ID does not exist!" });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpDetails = { otp, emp_id, email_id: employeeExist.email };
    console.log("OTP generated");

    // Check if OTP already exists and update or create new
    const isOtpExist = await OTP.findOne({ emp_id });
    if (isOtpExist) {
      await OTP.findByIdAndUpdate(isOtpExist._id, { otp });
    } else {
      await new OTP(otpDetails).save();
    }

    console.log(`OTP for emp_id ${emp_id}: ${otp}`);

    return res.status(200).json({
      message: "OTP sent successfully",
      data: { emp_id },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify OTP ***************************************************************************
const verifyOtp = async (req, res) => {
  try {
    const { emp_id, otp } = req.body;
    if (!emp_id || !otp) {
      return res.status(400).json({ error: "emp_id and otp are required!" });
    }

    const otpDetails = await OTP.findOne({ emp_id });
    if (!otpDetails) {
      return res
        .status(404)
        .json({ error: "OTP not found. Please request a new OTP." });
    }

    if (otpDetails.otp !== otp) {
      if (otpDetails.count >= 2) {
        // Third incorrect attempt
        await OTP.findByIdAndDelete(otpDetails._id);
        return res
          .status(429)
          .json({
            error: "Too many incorrect attempts. Please try again later.",
          });
      }
      await OTP.findByIdAndUpdate(otpDetails._id, { $inc: { count: 1 } });
      return res.status(400).json({ error: "Invalid OTP. Please try again!" });
    }

    await OTP.findByIdAndDelete(otpDetails._id);

    // Fetch employee details
    const employee = await Employee.findOne({ emp_id });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found!" });
    }

    if (!employee.role) {
      return res
        .status(400)
        .json({ error: "Role is not defined for this user" });
    }

    // Generate token
    const token = await generateToken(
      employee._id,
      employee.role,
      employee.emp_id
    );

    res.status(200).json({ message: "Login successful", data: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createEmp, login, verifyOtp };
