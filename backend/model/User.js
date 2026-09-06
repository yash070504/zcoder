const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username : {
     type:String ,
     required: true,
  },
  password : {
      type : String,
      required : true
  },
  
email : {
  type : String ,
  required : true ,
},
profileUrl : {
  type : String,
  default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
}
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel ;
