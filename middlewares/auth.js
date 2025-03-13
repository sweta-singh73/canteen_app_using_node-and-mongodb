const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    // Check if authorization header is provided
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: "Authorization token is required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    req.user = decoded;
    console.log("user decoded token", req.user);
    console.log("decoded", decoded);
    
    return next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Handle expired token error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Catch any other errors
    return res.status(500).json({ error: error.message });
  }
};

module.exports = verifyToken;
