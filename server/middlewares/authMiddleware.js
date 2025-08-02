const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);
    
    // ✅ Attach userId to `req`, not `req.body`
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).send({ success: false, message: 'Invalid token' });
  }
};
