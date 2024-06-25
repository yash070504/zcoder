const asyncHandler = require("express-async-handler")
const mongoose = require('mongoose')
const User = require('../model/User')
const Promblem = require('../model/Promblem')

const getAllPromblem = asyncHandler( async(req,res)=> {
   const promblem = await Promblem.find({})
   if(!promblem){
     return res.status(404).json({message : "NO Promblem"})
   }
 
  res.json(promblem);
})

const postPromblem = asyncHandler(async(req,res) => { 
  
  const {user,difficult, title,description,testcase,solution} = req.body ;
  if(!user || !title ||!description || !testcase ||!solution ||!difficult){
      res.status(404).json({message : "All fields are required"});
  }
   
  const duplicate = await Promblem.findOne({title }).lean().exec();

  if(duplicate){
    res.status(409).json({message : 'Duplicate Title is Found'})
  }
  const promblem = await Promblem.create({
     user,
      title,
      description,
      testcase,
      solution,
      difficult
  })

  if(promblem){
     res.status(201).json({message : "Promblem is Created"})

  }else{
    return res.status(400).json({ message: 'Invalid  data received' })
  }

})

const updatePromblem = asyncHandler(async(req,res) => {
  const {id,user,difficult, title,description,testcase,solution} = req.body ;

  if(!id || !user || !title ||!description || !testcase ||!solution ||!difficult){
    res.status(404).json({message : "All fields are required"});
}

const promblem = await Promblem.findById(id);

promblem.user = user ;
promblem.difficult = difficult ;
promblem.title = title ;
promblem.description =description;
promblem.testcase = testcase ;
promblem.solution= solution ;
 
const updatePromblem = await promblem.save()

res.json('Update')

    
})


const deletePromblem = asyncHandler(async(req,res) => {
    const {id} = req.body ;
    if (!id) {
      return res.status(400).json({ message: 'Promblem ID required' })
  }

  // Confirm promblem exists to delete 
  const promblem = await Promblem.findById(id)

  if (!promblem) {
      return res.status(400).json({ message: 'Promblem not found' })
  }

  const result = await promblem.deleteOne()

  const reply = `Promblem '${result.title}' with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
   getAllPromblem,
   postPromblem,
   deletePromblem,
   updatePromblem
}