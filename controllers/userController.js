const Employee = require("../models/employee");
const OTP = require("../models/otp");
const empValidationSchema = require("../helpers/validation");

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




module.exports = { createEmp, login, verifyOtp, getUserByName, viewUser };
