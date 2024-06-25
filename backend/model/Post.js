const mongoose = require("mongoose") ;


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


const postSchema = new mongoose.Schema({
   title : {
     type : String,
     required: true,
   },
   body :{
     type:String ,
     required :  true ,
   },
   user : {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
     ref: 'User'
   },
   tags : {
     type : Array 
   },
   comments: [{
    type: commentSchema, 
   
  }],
})

const postModel = mongoose.model("Post",postSchema);

module.exports = postModel