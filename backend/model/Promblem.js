const mongoose = require('mongoose')

const promblemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
},
  title:{
    type: String,
    required: true,
    
},
difficult : {
    type: String ,
    required : true,
},

description:{
    type: String,
    required: true,
},
testcase : {
   type : String ,
   required: true,
},
solution:{
  type: String,
  required: true,
},
},{
   timestamps :true 
})

module.exports = mongoose.model('Promblem', promblemSchema)