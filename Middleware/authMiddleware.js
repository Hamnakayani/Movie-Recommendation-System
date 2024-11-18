const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      if (!decoded.id) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Invalid token: User not found' });
      }

      
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Error:', error); 
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }
};

module.exports = authenticateJWT;
