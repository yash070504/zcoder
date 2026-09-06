const asyncHandler = require("express-async-handler");
const Promblem = require('../model/Promblem');

const getAllPromblem = asyncHandler(async (req, res) => {
  const promblems = await Promblem.find({}).lean();
  if (!promblems?.length) {
    return res.status(200).json([]);
  }
  res.json(promblems);
});

const postPromblem = asyncHandler(async (req, res) => {
  const { user, difficult, title, description, testcase, solution } = req.body;

  if (!user || !title || !description || !testcase || !solution || !difficult) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Promblem.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate Title is Found' });
  }

  const promblem = await Promblem.create({
    user,
    title,
    description,
    testcase,
    solution,
    difficult
  });

  if (promblem) {
    return res.status(201).json({ message: "Promblem is Created", promblem });
  } else {
    return res.status(400).json({ message: 'Invalid data received' });
  }
});

const updatePromblem = asyncHandler(async (req, res) => {
  const { id, user, difficult, title, description, testcase, solution } = req.body;

  if (!id || !user || !title || !description || !testcase || !solution || !difficult) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const promblem = await Promblem.findById(id).exec();
  if (!promblem) {
    return res.status(404).json({ message: "Promblem not found" });
  }

  // Check for duplicate title
  const duplicate = await Promblem.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate title is found' });
  }

  promblem.user = user;
  promblem.difficult = difficult;
  promblem.title = title;
  promblem.description = description;
  promblem.testcase = testcase;
  promblem.solution = solution;

  const updatedPromblem = await promblem.save();
  res.json({ message: 'Promblem Updated', updatedPromblem });
});

const deletePromblem = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Promblem ID required' });
  }

  const promblem = await Promblem.findById(id).exec();

  if (!promblem) {
    return res.status(404).json({ message: 'Promblem not found' });
  }

  const result = await promblem.deleteOne();
  const reply = `Promblem '${result.title}' with ID ${result._id} deleted`;
  res.json({ message: reply });
});

module.exports = {
  getAllPromblem,
  postPromblem,
  deletePromblem,
  updatePromblem
};