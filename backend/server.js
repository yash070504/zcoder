require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const connectdb = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const dbCheck = require("./middleware/dbCheck");

const router = require("./routes/root");
const userRouter = require("./routes/userRouter");
const promblemRouter = require("./routes/promblemRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

// Connect to MongoDB in background
connectdb();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Static routes & page serving
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", router);

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStates = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "OK",
    uptime: process.uptime(),
    database: dbStates[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString()
  });
});

// API Routes (guarded by dbCheck)
app.use("/auth", dbCheck, authRouter);
app.use("/user", dbCheck, userRouter);
app.use("/promblem", dbCheck, promblemRouter);
app.use("/post", dbCheck, postRouter);
app.use("/comment", dbCheck, commentRouter);

// 404 Handler
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Centralized Error Handler
app.use(errorHandler);

// Start server immediately so it never hangs waiting for DB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB is connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message || err);
});
