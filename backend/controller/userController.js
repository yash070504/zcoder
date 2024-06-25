const User = require('../model/User')
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler")
const mongoose = require('mongoose')

const getAllUser = asyncHandler(async(req,res) => {
   const user = await User.find({})
   if(!user){
     return res.status(400).json({message : 'No User'})
   }
   res.json(user);
})


const  createNewUser = asyncHandler(async (req,res) => { 

     console.log(req.body)
     const {username , password ,email ,profileUrl} = req.body ;

     if(!username || !password || !email || !profileUrl){
      res.status(400).json({message : "All fields Are Required"})
     }

     const duplicate = await User.findOne({username})

     if(duplicate){
      return res.status(409).json({message : 'Duplicate Username'});
     }

     const hashedPwd = await bcrypt.hash(password,10);
     console.log(password,hashedPwd);
     const userObject = {
       username ,
       "password" : hashedPwd ,
       email ,
       profileUrl
     }

     const newUser = await User.create(userObject) ;

     if(newUser) {
      // created
    return res.status(201).json({meassage : "create"}
     ) ;
   }else{
      return res.status(400).json({ message : 'Invaild user data recieved'}) ;
   }

})

const updateUser = asyncHandler(async (req, res) => {  
  
  const {id,username , password ,email ,profileUrl} = req.body ;

  if(!username || !id|| !email || !profileUrl){
    res.status(400).json({message : "All fields Are Required"})
   }

   const user = await User.findById(id) ;
   if (!user) {
    return res.status(400).json({ message: 'User not found' })
  
}

// Check for duplicate 
const duplicate = await User.findOne({ username })
 
if (duplicate && duplicate?._id.toString() !== id) {
  return res.status(409).json({ message: 'Duplicate username' })
}
 
user.username = username ;
user.email = email ;
user.profileUrl = profileUrl ;

if(password) { 
  user.password = await bcrypt.hash(password, 10) 
}
const updatedUser = await user.save()

res.json({ message: `${updatedUser.username} updated` })
} 
)

const deleteUser = asyncHandler(async (req,res) => {
  const {id} = req.body ;
  if(!id){
   return  res.status(400).json({message : 'User Id Is required'})
  }

  const user = await User.findById({"_id" : id}).exec();

  if(!user){
     return res.status(400).json({message : 'User is not found'});

  }

  const result = await user.deleteOne() ;

  const reply = `Username ${result.username} with ID ${result._id}`;

  res.json(reply);

} ) ;



module.exports = { 
   getAllUser ,
   createNewUser,
   updateUser ,
   deleteUser,
}