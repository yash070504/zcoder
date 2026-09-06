// ═══════════════════════════════════════════════════════════
// User.js — MongoDB Schema/Model for a ZCoder User
// This defines the shape of every user document stored in MongoDB.
// Collection name: 'users' (Mongoose auto-pluralizes 'User')
// ═══════════════════════════════════════════════════════════
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // The user's unique display name — used for login and shown across the app
  username : {
     type: String,
     required: true,
  },

  // Hashed password — stored using bcrypt (never plain text!)
  // bcrypt adds salt automatically making it safe even if DB is leaked
  password : {
      type : String,
      required : true
  },

  // User's email address — required for account creation
  email : {
    type : String,
    required : true,
  },

  // URL to the user's profile picture/avatar
  // Defaults to empty string — app will show a generated SVG avatar if empty
  profileUrl : {
    type : String,
    default: ""
  }
})

// Create the Mongoose model — generates a 'users' collection in MongoDB
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
