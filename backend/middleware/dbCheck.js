const mongoose = require("mongoose");

const dbCheck = (req, res, next) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    const states = { 0: "disconnected", 2: "connecting", 3: "disconnecting" };
    return res.status(503).json({
      message: "Database unavailable: MongoDB is not connected. If using MongoDB Atlas, your cluster may be paused due to inactivity (after 3-4 months). Please unpause it at cloud.mongodb.com or update DATABASE_URI in backend/.env.",
      dbStatus: states[mongoose.connection.readyState] || "unknown"
    });
  }
  next();
};

module.exports = dbCheck;
