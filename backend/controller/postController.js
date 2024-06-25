const asyncHandler = require("express-async-handler")
const User = require('../model/User')
const Post = require("../model/Post")
const Comment = require("../model/Comment")

const getAllPosts = asyncHandler(async(req,res) => {
   const user = await User.find({})
   const posts = await Post.find({})
   if(!posts){
     return res.status(400).json({message : "No Post"})
   }
  const postWithUsername = await Promise.all(posts.map(async(post) => {
     
      const user = await User.findById(post.user);
      const postObject = {
         _id : post._id ,
         title : post.title ,
         body : post.body ,
         tags : post.tags ,
         comments : post.comments,
         __v : post.__v,
         username : user.username
      }
      return postObject
  }))
    res.json(postWithUsername);
})



const createPost = asyncHandler(async(req,res) => {
   const {title,body,user,tags,comment} = req.body ;
   if(!title || !body || !user){
    res.status(404).json({message : "All fields are required"});
   }

   const post = await Post.create({
       title ,
       body ,
       user,
       tags,
       comment
   })

   if(post){
    res.status(201).json({message : "Post is Created"})

 }else{
   return res.status(400).json({ message: 'Invalid  data received' })
 }

})

const getPost = asyncHandler(async(req,res) => {
   const {postId} = req.body ;
   const post = await Post.findById(postId);
   if(!post){
     return res.json({message : "No Post Find"})
   }
   res.json(post);
})

const commentOnPost = asyncHandler(async(req,res) => {
   const {message ,userId,postId} = req.body ;
   if(!message || !userId || !postId){
     return res.status(401).json({message : "All fields is required"})
   }
   const user =await User.findById(userId)
   const comment = await Comment.create({
    message ,createdBy : user.username,postId
   })
   const post = await Post.findById(postId);

   if(comment){
  
     post.comments.push(comment)
     const updatePost = await post.save() ;
     
     res.status(201).json({message : "Comment is Added"})
   }

})

const getComment = asyncHandler(async(req,res)=> {
   const {postId} = req.body ;
   const post = await Post.findById(postId)
   let content ;
   content = post.comments.map(async(id) => {
    console.log(id)
   })
   res.json(content)
})

const deletePost = asyncHandler(async(req,res) => {
   
   const {id} = req.body ;
   const post = await Post.findById(id)
   if (!id) {
      return res.status(400).json({ message: 'Post ID required' })
  }


   const result = await post.deleteOne()

   const reply = `Post '${result.title}' with ID ${result._id} deleted`
 
   res.json(reply)
   
})

module.exports = {getAllPosts,
   createPost,
   getPost ,
   commentOnPost,
   getComment,
   deletePost
}