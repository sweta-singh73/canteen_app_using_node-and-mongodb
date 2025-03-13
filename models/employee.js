const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  emp_id: {
    type:Number,
    required:true,
  },
  name:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["user", "admin"],
    default:"user",
    required:true
  },
  email:{
    type:String,
    required:true,
  },
  department:{
    type:String,
    required:true
  },
  balance:{
    type:Number,
    required:true,
    default:0
  },
  wallet:{
    type:Number,
    required:true,
    default:0
  }

},
{
  timestamps:true,
});

const Employee = mongoose.model("employee", employeeSchema);
module.exports = Employee;