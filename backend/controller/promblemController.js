const asyncHandler = require("express-async-handler");
const Promblem = require('../model/Promblem');

const getAllPromblem = asyncHandler(async (req, res) => {
  const includeHidden = req.query.includeHidden === "true";
  const promblems = await Promblem.find({}).lean();
  if (!promblems?.length) {
    return res.status(200).json([]);
  }

  // Sanitize hidden testcases for candidate safety unless explicitly authorized
  const sanitized = promblems.map((p) => {
    if (!includeHidden) {
      const { hiddenTestCases, ...safeProblem } = p;
      return safeProblem;
    }
    return p;
  });

  res.json(sanitized);
});

const postPromblem = asyncHandler(async (req, res) => {
  const {
    user,
    difficult,
    title,
    description,
    testcase,
    solution,
    sampleTestCases = [],
    hiddenTestCases = [],
    timeLimitMs = 4000,
    memoryLimitMb = 256
  } = req.body;

  if (!user || !title || !description || !difficult) {
    return res.status(400).json({ message: "Required fields: user, title, description, difficult" });
  }

  const duplicate = await Promblem.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate Title is Found' });
  }

  const promblem = await Promblem.create({
    user,
    title,
    description,
    testcase: testcase || "",
    solution: solution || "",
    difficult,
    sampleTestCases,
    hiddenTestCases,
    timeLimitMs,
    memoryLimitMb
  });

  if (promblem) {
    return res.status(201).json({ message: "Promblem is Created", promblem });
  } else {
    return res.status(400).json({ message: 'Invalid data received' });
  }
});

const updatePromblem = asyncHandler(async (req, res) => {
  const {
    id,
    user,
    difficult,
    title,
    description,
    testcase,
    solution,
    sampleTestCases,
    hiddenTestCases,
    timeLimitMs,
    memoryLimitMb
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Promblem ID is required" });
  }

  const promblem = await Promblem.findById(id).exec();
  if (!promblem) {
    return res.status(404).json({ message: "Promblem not found" });
  }

  // Check for duplicate title if changing title
  if (title && title !== promblem.title) {
    const duplicate = await Promblem.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate title is found' });
    }
    promblem.title = title;
  }

  if (user) promblem.user = user;
  if (difficult) promblem.difficult = difficult;
  if (description) promblem.description = description;
  if (testcase !== undefined) promblem.testcase = testcase;
  if (solution !== undefined) promblem.solution = solution;
  if (sampleTestCases !== undefined) promblem.sampleTestCases = sampleTestCases;
  if (hiddenTestCases !== undefined) promblem.hiddenTestCases = hiddenTestCases;
  if (timeLimitMs !== undefined) promblem.timeLimitMs = timeLimitMs;
  if (memoryLimitMb !== undefined) promblem.memoryLimitMb = memoryLimitMb;

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

  const title = promblem.title;
  const promblemId = promblem._id;
  await promblem.deleteOne();
  const reply = `Promblem '${title}' with ID ${promblemId} deleted`;
  res.json({ message: reply });
});

module.exports = {
  getAllPromblem,
  postPromblem,
  deletePromblem,
  updatePromblem
};