const jwt = require('jsonwebtoken');

const updateProfileMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
          if (err) return res.sendStatus(403); //invalid token
          req.user = decoded.UserInfo.username;
          req.roles = decoded.UserInfo.roles;
          req.id = decoded.UserInfo.id;
      }
    );

    // Check if the user is authorized to update the profile
    if (req.id !== req.params.id) {
      return res.status(403).json({ "message": 'Forbidden' });
    }

    // If the user is authenticated and authorized, continue to the next middleware or route handler
    next();
};

module.exports = updateProfileMiddleware;