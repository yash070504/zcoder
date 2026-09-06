const User = require("../model/User");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'yashkumar070504';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET || 'yashkumar070504';

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized' });

  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": foundUser.username,
      }
    },
    ACCESS_SECRET,
    { expiresIn: '30d' }
  );

  const refreshToken = jwt.sign(
    {
      "username": foundUser.username,
    },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'None' : 'Lax', // Lax for local development
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.json({ accessToken });
});

// Refresh token handler
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    REFRESH_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({ username: decoded.username }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": foundUser.username,
          }
        },
        ACCESS_SECRET,
        { expiresIn: '30d' }
      );

      res.json({ accessToken });
    })
  );
};

// Clear cookies on logout
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  });
  res.json({ message: 'Cookie cleared' });
};

module.exports = { login, refresh, logout };