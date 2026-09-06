const jwt = require('jsonwebtoken');
require("dotenv").config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'yashkumar070504';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET || 'yashkumar070504';

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // First try ACCESS_SECRET
  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded?.UserInfo?.username || decoded?.username;
      return next();
    }

    // Fallback try REFRESH_SECRET (e.g. if token came from cookie)
    jwt.verify(token, REFRESH_SECRET, (err2, decoded2) => {
      if (!err2) {
        req.user = decoded2?.UserInfo?.username || decoded2?.username;
        return next();
      }
      return res.status(403).json({ message: 'Forbidden' });
    });
  });
};

module.exports = verifyJWT;