const jwt = require('jsonwebtoken');
const User = require('../models/User');


const requireAuth = async (req, res, next) => {
  try {

    let token = req.cookies.token;

    if (!token) {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        token = authHeader.replace(/^Bearer\s+/i, '');
      }
    }

    
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized Access, Wrong token.'
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decoded.id);

  
    if (!user) {
      return res.status(401).json({
        message: 'Account no longer exists.'
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Session expired. Please log in again.'
    });
  }
};

module.exports = requireAuth;

