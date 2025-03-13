const Employee = require("../models/employee");
const OTP = require("../models/otp");
const empValidationSchema = require("../helpers/validation");
const { generateToken, generateOtp } = require("../helpers/authHelper");

//create user***************************************************************************
const createEmp = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = empValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { emp_id, name, role, email, department } = value;

    // Check if employee ID already exists
    const employeeExist = await Employee.findOne({ emp_id });
    if (employeeExist) {
      return res.status(403).json({ error: "This emp ID already exists. Please choose another one." });
    }

    // Create new employee
    const empData = new Employee({
      emp_id,
      name,
      role,
      email,
      department,
    });

    const empDetails = await empData.save();

    return res.status(200).json({ message: "User created successfully", data: empDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


//login user****************************************************************************
const login = async (req, res) => {
  try {
  
    const { emp_id } = req.body;
 
    if(!emp_id )return res.status(400).json({error:"Employee Id required"})
   
    const employeeExist = await Employee.findOne({ emp_id });
    if (!employeeExist)
      return res
        .status(400)
        .json({ error: "This employee id does not exist!" });

    // Generate the new OTP
    let otp = generateOtp(); // No need to await this now
    let otpDetails = {
      otp: otp,
      emp_id: emp_id,
      email_id: employeeExist.email,
    };

    const isOtpExist = await OTP.findOne({ emp_id: emp_id });
    if (isOtpExist) {
      await OTP.findByIdAndUpdate(isOtpExist._id, { otp: otp });
    } else {
      // Save new OTP in database
      const otpData = new OTP(otpDetails);
      await otpData.save();
    }

    // Simulate sending the OTP (in practice, you would send it via SMS or email)
    console.log(`OTP for emp_id ${emp_id}: ${otp}`);

    return res.status(200).json({
      statusCode: 200,
      message: "OTP sent successfully.",
      data: { emp_id: emp_id },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//verify otp function*******************************************************************
const verifyOtp = async (req, res) => {
  try {
    
    const { emp_id, otp } = req.body;
    if (!emp_id || !otp)
      return res.status(400).json({ error: "emp_id and otp are required!" });

    const otpDetails = await OTP.findOne({ emp_id });
    if (!otpDetails)
      return res.status(400).json({ error: "OTP not found. Please request a new OTP." });

    if (otpDetails.otp !== otp) {
      await OTP.findByIdAndUpdate(otpDetails._id, { $inc: { count: 1 } });

      if (otpDetails.count >= 3) {
        await OTP.findByIdAndDelete(otpDetails._id);
        return res.status(400).json({ error: "Too many incorrect attempts. Please try again later." });
      }
      return res.status(400).json({ error: "Invalid OTP. Please try again!" });
    }

    await OTP.findByIdAndDelete(otpDetails._id);

    // Fetch employee details to get the role
    const employee = await Employee.findOne({ emp_id });
    if (!employee) {
      return res.status(400).json({ error: "Employee not found!" });
    }

    // ✅ Check if the role exists before generating the token
    if (!employee.role) {
      return res.status(400).json({ error: "Role is not defined for this user" });
    }

    // Generate token with emp_id and role
    const token = await generateToken(employee._id, employee.role);

    return res.status(200).json({ message: "Login successful", data: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


//list user***************************************************************************** 
// const userList = async(req, res)=>{
//   const {emp_id, balance, wallet} = req.query
//   try {
//     const query = {};
//     if(emp_id)query.emp_id = 
//     if(balance)query.balance = 
//     const user = await Employee.find({
      
//     })
//   } catch (error) {
//     return res.status(500).json({error:error.message});
//   }
// }

//view user****************************************************************************
const viewUser = async(req, res)=>{
  try {
    const {emp_id} = req.body;
    if(!emp_id)return res.status(400).json({error:"emp_id is required!"});

    const emp = await Employee.findOne({emp_id});
    if(!emp)return res.status(400).json({error:"emp does not exist"});

    return res.status(200).json({message:"User fetch successfully", data:emp});

  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}

//find emp by name**********************************************************************
const getUserByName = async(req, res)=>{
try {
      // Validate the incoming request body using Joi schema
      const { error } = empValidationSchema.validate(req.body);
    
      // If there is a validation error, return a 400 status with the error details
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  const {emp_id} = req.body;
  if(!emp_id)return res.status(400).json({error:"emp_id and emp_name is required"});

  const employee = await Employee.findOne({emp_id});
  if(!employee)return res.status(400).json({error:"emp not found!"});

  const payload = {
    emp_id:employee.emp_id,
    emp_name:employee.name
  }

  return res.status(200).json({message:"employee fetch successfully", data:payload});

} catch (error) {
  return res.status(500).json({error:error.message});
}
}

//logout*******************************************************************************
const logout = async(req, res)=>{
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}


module.exports = { createEmp, login, verifyOtp, getUserByName, viewUser };
