const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require('../model/User');
const Post = require("../model/Post");
const Comment = require("../model/Comment");

const getAllPosts = asyncHandler(async (req, res) => {
  // Sort with latest posts at the top
  const posts = await Post.find({}).sort({ _id: -1 }).lean().exec();
  if (!posts?.length) {
    return res.status(200).json([]);
  }

  const postWithUsername = await Promise.all(posts.map(async (post) => {
    let username = 'Anonymous';
    let authorAvatar = '';
    if (post.user) {
      let user = null;
      if (mongoose.Types.ObjectId.isValid(post.user)) {
        user = await User.findById(post.user).select('username profileUrl').lean().exec();
      }
      if (!user) {
        user = await User.findOne({ username: post.user }).select('username profileUrl').lean().exec();
      }
      if (user?.username) {
        username = user.username;
        authorAvatar = user.profileUrl || '';
      }
    }
    return {
      _id: post._id,
      title: post.title,
      body: post.body,
      tags: post.tags || [],
      comments: post.comments || [],
      __v: post.__v,
      username,
      authorAvatar,
      createdAt: post.createdAt || post._id.getTimestamp()
    };
  }));

  res.json(postWithUsername);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, body, user, tags, comments } = req.body;
  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  let resolvedUserId = user;
  if (!resolvedUserId || !mongoose.Types.ObjectId.isValid(resolvedUserId)) {
    const lookupName = user || req.user;
    if (lookupName) {
      const userDoc = await User.findOne({ username: lookupName }).exec();
      if (userDoc) resolvedUserId = userDoc._id;
    }
  }

  if (!resolvedUserId) {
    return res.status(400).json({ message: "A valid user ID or username is required" });
  }

  const post = await Post.create({
    title,
    body,
    user: resolvedUserId,
    tags: tags || [],
    comments: comments || []
  });

  if (post) {
    return res.status(201).json({ message: "Post is Created", post });
  } else {
    return res.status(400).json({ message: 'Invalid data received' });
  }
});

const getPost = asyncHandler(async (req, res) => {
  const postId = req.params?.id || req.query?.id || req.body?.postId;
  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  const post = await Post.findById(postId).lean().exec();
  if (!post) {
    return res.status(404).json({ message: "No Post Found" });
  }

  let username = 'Anonymous';
  let authorAvatar = '';
  if (post.user) {
    let user = null;
    if (mongoose.Types.ObjectId.isValid(post.user)) {
      user = await User.findById(post.user).select('username profileUrl').lean().exec();
    }
    if (!user) {
      user = await User.findOne({ username: post.user }).select('username profileUrl').lean().exec();
    }
    if (user?.username) {
      username = user.username;
      authorAvatar = user.profileUrl || '';
    }
  }

  res.json({
    ...post,
    username,
    authorAvatar,
    createdAt: post.createdAt || post._id.getTimestamp()
  });
});

const commentOnPost = asyncHandler(async (req, res) => {
  const { message, userId, postId } = req.body;
  if (!message || !userId || !postId) {
    return res.status(400).json({ message: "message, userId, and postId are required" });
  }

  const user = await User.findById(userId).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const post = await Post.findById(postId).exec();
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = await Comment.create({
    message,
    createdBy: user.username,
    postId
  });

  if (comment) {
    post.comments.push(comment);
    await post.save();

    let authorUsername = "Author";
    if (post.user) {
      const authorUser = await User.findById(post.user).select('username').lean().exec();
      if (authorUser?.username) {
        authorUsername = authorUser.username;
      }
    }

    return res.status(201).json({ 
      message: "Comment is Added", 
      comment,
      authorUsername,
      postTitle: post.title,
      commenter: user.username
    });
  } else {
    return res.status(400).json({ message: "Failed to add comment" });
  }
});

const getComment = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }
  const post = await Post.findById(postId).exec();
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post.comments || []);
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Post ID required' });
  }

  const post = await Post.findById(id).exec();
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const title = post.title;
  const postId = post._id;
  await post.deleteOne();
  const reply = `Post '${title}' with ID ${postId} deleted`;
  res.json({ message: reply });
});

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  commentOnPost,
  getComment,
  deletePost
};