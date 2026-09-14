// ═══════════════════════════════════════════════════════════
// authControrller.js — Handles all Authentication logic
// Functions: login, refresh (token), logout
//
// How JWT auth works in this app:
//  1. User logs in → gets an ACCESS TOKEN (short lived) + a REFRESH TOKEN (cookie)
//  2. Access token is stored in Redux / localStorage → sent in every API request header
//  3. Refresh token is stored in an HTTP-only cookie → used to get new access tokens
//  4. When access token expires (403) → frontend calls /auth/refresh automatically
// ═══════════════════════════════════════════════════════════

const User = require("../model/User");
const asyncHandler = require('express-async-handler'); // Wraps async functions — auto-catches errors
const bcrypt = require('bcrypt');                      // Hashes passwords securely (never store plain text!)
const jwt = require('jsonwebtoken');                   // Creates and verifies JWT tokens
require("dotenv").config();

// Secret keys used to sign tokens — loaded from .env file
// NEVER hardcode real secrets in production
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'yashkumar070504';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET || 'yashkumar070504';

// ── LOGIN ────────────────────────────────────────────────────
// POST /auth
// Request body: { username, password }
// Response: { accessToken } + sets 'jwt' cookie with refreshToken
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate that both fields were provided
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Look up user in MongoDB by username
  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: 'Unauthorized' }); // User doesn't exist
  }

  // Compare the plain text password against the stored bcrypt hash
  // bcrypt.compare safely checks without needing to decrypt
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized' }); // Wrong password

  // Create a short-lived ACCESS TOKEN (used in Authorization header)
  // Payload: UserInfo.username → read by verifyJWT middleware as req.user
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": foundUser.username,
      }
    },
    ACCESS_SECRET,
    { expiresIn: '30d' } // 30 days — normally this would be 15 minutes in production
  );

  // Create a REFRESH TOKEN (stored in http-only cookie — not accessible by JavaScript)
  // Used only to get a new access token when the current one expires
  const refreshToken = jwt.sign(
    {
      "username": foundUser.username,
    },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Set the refresh token as an HTTP-only cookie
  // httpOnly: true → JS cannot read this cookie (prevents XSS attacks)
  // secure: true → Only sent over HTTPS in production
  // sameSite: 'None' → Required for cross-domain cookies (Vercel frontend → Render backend)
  res.cookie('jwt', refreshToken, {
    httpOnly: true,        // accessible only by web server
    secure: isProduction,  // HTTPS only in production
    sameSite: isProduction ? 'None' : 'Lax', // Lax for local development
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  });

  // Send only the access token in the response body (not the refresh token)
  res.json({ accessToken });
});

// ── REFRESH TOKEN ────────────────────────────────────────────
// GET /auth/refresh
// No request body — uses the 'jwt' cookie sent automatically
// Response: { accessToken } — a fresh new access token
const refresh = (req, res) => {
  const cookies = req.cookies;

  // If no refresh token cookie exists → user is not logged in
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  // Verify the refresh token is genuine and not expired
  jwt.verify(
    refreshToken,
    REFRESH_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' }); // Token invalid/expired

      // Find the user from the decoded token data
      const foundUser = await User.findOne({ username: decoded.username }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      // Issue a brand new access token
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

// ── LOGOUT ────────────────────────────────────────────────────
// POST /auth/logout
// Clears the JWT refresh token cookie — effectively logs user out
// The access token on the frontend expires naturally
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content — already logged out
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  });
  res.json({ message: 'Cookie cleared' });
};

module.exports = { login, refresh, logout };