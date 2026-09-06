// ═══════════════════════════════════════════════════════════
// Post.js — MongoDB Schema/Model for Community Forum Posts
// A Post has a title, body, tags, likes array, and embedded comments.
// The embedded commentSchema here is for inline comments stored within a post.
// There is also a separate Comment.js model for standalone comment operations.
// ═══════════════════════════════════════════════════════════
const mongoose = require("mongoose") ;


// Embedded sub-schema for comments stored inside a Post document
// These are used when fetching a single post with its comments all at once
const commentSchema = new mongoose.Schema({
  message : {
      type : String,
      required : true,
  },

  // Username of the person who wrote the comment
  createdBy: {
    type: String,
    required: true,
  },

  // Reference to the parent Post document (so we can find the post from a comment)
  postId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Post",       // links to Post model
     required: true,
  }
})


// Main Post schema — represents a single community forum post
const postSchema = new mongoose.Schema({
   // Post heading shown in the community feed
   title : {
     type : String,
     required: true,
   },

   // Main content/body of the post (can be markdown or plain text)
   body :{
     type: String,
     required : true,
   },

   // Reference to the User who created this post
   user : {
     type: mongoose.Schema.Types.ObjectId,
     required: true,
      ref: 'User'        // links to User model
   },

   // Array of tag strings like ['javascript', 'algorithms']
   tags : {
     type : Array
   },

   // Array of usernames who have liked this post
   // e.g. ['yash', 'alice'] — used to check if current user already liked it
   likes: [{
     type: String
   }],

   // Array of embedded comment objects (using the commentSchema above)
   comments: [{
     type: commentSchema,
  }],
})

const postModel = mongoose.model("Post",postSchema);

module.exports = postModel