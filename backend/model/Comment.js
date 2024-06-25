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