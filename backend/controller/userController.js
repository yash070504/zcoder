const User = require('../model/User');
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').lean();
  if (!users?.length) {
    return res.status(200).json([]);
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email, profileUrl } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Username, password, and email are required" });
  }

  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate Username' });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = {
    username,
    password: hashedPwd,
    email,
    profileUrl: profileUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  };

  const newUser = await User.create(userObject);

  if (newUser) {
    return res.status(201).json({ message: "New user created successfully" });
  } else {
    return res.status(400).json({ message: 'Invalid user data received' });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, email, profileUrl } = req.body;

  if (!username || !id || !email || !profileUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check for duplicate username with other users
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  user.username = username;
  user.email = email;
  user.profileUrl = profileUrl;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const username = user.username;
  const userId = user._id;
  await user.deleteOne();
  const reply = `Username ${username} with ID ${userId} deleted`;
  res.json({ message: reply });
});

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
};