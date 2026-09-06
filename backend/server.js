// ═══════════════════════════════════════════════════════════
// server.js — The ENTRY POINT of the entire backend
// This file starts the Express server, connects all middleware,
// routes, and database. Everything begins here.
// Run with: npm start (uses node server.js)
// Port: 3500 locally, or process.env.PORT on Render
// ═══════════════════════════════════════════════════════════

// Load environment variables from .env file FIRST before anything else
require("dotenv").config();

const express = require("express");
const app = express();               // Create the Express application
const path = require("path");        // For building file paths
const PORT = process.env.PORT || 3500; // Render sets PORT automatically
const connectdb = require("./config/dbConnect");    // MongoDB connection function
const cookieParser = require("cookie-parser");      // Reads cookies (refresh token stored here)
const mongoose = require("mongoose");               // MongoDB ODM
const cors = require("cors");                       // Cross-Origin Resource Sharing
const corsOptions = require("./config/corsOptions"); // Which frontends can access this API
const errorHandler = require("./middleware/errorHandler"); // Central error handling
const dbCheck = require("./middleware/dbCheck");    // Block requests if DB is disconnected

// ── Route Handlers ──────────────────────────────────────────
// Each router handles a group of related API endpoints
const router = require("./routes/root");              // GET / → serves static HTML pages
const userRouter = require("./routes/userRouter");    // /user → register, get, edit, delete
const promblemRouter = require("./routes/promblemRouter"); // /promblem → coding problems CRUD
const authRouter = require("./routes/authRouter");    // /auth → login, refresh, logout
const postRouter = require("./routes/postRouter");    // /post → community posts, likes, comments
const commentRouter = require("./routes/commentRouter"); // /comment → standalone comments
const codeRouter = require("./routes/codeRouter");   // /execute → run code server-side

// Connect to MongoDB in background
// Server starts even if DB takes a few seconds to connect
connectdb();

// ── Global Middleware (runs on EVERY request) ────────────────
app.use(cors(corsOptions));   // Allow frontend domains (Vercel) to access backend (Render)
app.use(express.json());      // Parse incoming JSON request bodies (req.body)
app.use(cookieParser());      // Parse cookies from request (used for refresh token JWT)

// ── Static Files & Root HTML ─────────────────────────────────
// Serve files in /public folder (CSS, images) at the root URL
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", router); // Handles GET / → returns index.html from /views

// ── Code Execution Endpoints ─────────────────────────────────
// These endpoints receive source code and run it server-side (Node, Python, C++, Java)
// Mounted on both /execute and /api/execute for compatibility
app.use("/execute", codeRouter);
app.use("/api/execute", codeRouter);

// ── Health Check ─────────────────────────────────────────────
// Used by Render to verify the server is running
// Visit: https://zcoder-backend-o2ee.onrender.com/health
app.get("/health", (req, res) => {
  const dbStates = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "OK",
    uptime: process.uptime(),                              // How long server has been running
    database: dbStates[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString()
  });
});

// ── Protected API Routes ─────────────────────────────────────
// dbCheck middleware blocks requests if MongoDB is not yet connected
// This prevents 500 errors when DB takes a moment to connect after cold start
app.use("/auth", dbCheck, authRouter);         // Login, refresh token, logout
app.use("/user", dbCheck, userRouter);         // User CRUD + registration
app.use("/promblem", dbCheck, promblemRouter); // Coding problem CRUD
app.use("/post", dbCheck, postRouter);         // Community posts + likes + comments
app.use("/comment", dbCheck, commentRouter);   // Standalone comment operations

// ── 404 Handler ─────────────────────────────────────────────
// Catches any routes not matched above
// Returns HTML, JSON, or plain text based on what the client accepts
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html")); // Send custom 404 page
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// ── Centralized Error Handler ─────────────────────────────────
// Catches errors thrown in any route with next(err)
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
// Server starts IMMEDIATELY — doesn't wait for MongoDB
// This is important on Render so the health check passes quickly
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ── MongoDB Connection Events ────────────────────────────────
mongoose.connection.once("open", () => {
  console.log("MongoDB is connected successfully");
});

// Log any MongoDB errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message || err);
});
