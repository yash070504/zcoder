// ═══════════════════════════════════════════════════════════
// Comment.js — Standalone MongoDB Model for Post Comments
// Note: Post.js also has a commentSchema embedded inside it.
// This model is used when fetching or creating comments as independent documents.
// Collection name: 'comments'
// ═══════════════════════════════════════════════════════════
const mongoose = require("mongoose")


const commentSchema = new mongoose.Schema({
  message : {
      type : String ,
      required : true ,
  }, 

createdBy: {
   type: String,
   required: true,
},

postId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Post",
   required: true,
}
})


const commentModel = mongoose.model("Comment",commentSchema);

module.exports = commentModel ;