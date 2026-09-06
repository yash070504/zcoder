// ═══════════════════════════════════════════════════════════
// Promblem.js — MongoDB Schema/Model for Coding Problems
// Note: 'Promblem' is intentionally named this way (typo for 'Problem')
// A problem includes: title, difficulty, description, test cases, and solution
// Collection name: 'promblems'
// ═══════════════════════════════════════════════════════════
const mongoose = require('mongoose')

const promblemSchema = new mongoose.Schema({
  // The user who submitted this problem (reference to User model)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
},
  // Unique title of the coding problem
  title:{
    type: String,
    required: true,
},
  // Difficulty level — typically 'Easy', 'Medium', or 'Hard'
  difficult : {
    type: String,
    required : true,
},
  // Full problem description/statement
  description:{
    type: String,
    required: true,
},
  // Test cases to validate solutions (stored as a string, e.g. JSON or plain text)
  testcase : {
   type : String,
   required: true,
},
  // The reference/correct solution for this problem
  solution:{
    type: String,
    required: true,
},
},{
   timestamps: true // Automatically adds createdAt and updatedAt fields
})

module.exports = mongoose.model('Promblem', promblemSchema)