const express = require('express');
const {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
} = require('../controller/userController');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

// Public route: User registration
router.route("/")
  .post(createNewUser);

// Protected routes: Requires valid JWT token
router.route("/")
  .get(verifyJWT, getAllUser)
  .patch(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

module.exports = router;