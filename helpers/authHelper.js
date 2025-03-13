const JWT = require('jsonwebtoken');
const generateOtp = () => {
  // Generate 6 digit OTP 
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//create token
const generateToken = async(id, role)=>{
  try {
    let token = JWT.sign({ _id: id, role: role }, process.env.JWT_SECRET_KEY , { expiresIn: '24h' });
    return token;
  } catch (error) {
    return {error:error.message};
  }
}
module.exports = { generateOtp, generateToken };