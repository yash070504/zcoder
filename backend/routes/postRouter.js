const express = require("express");
const router = express.Router();
const { getAllPosts, createPost, getPost, commentOnPost, getComment, deletePost, likePost } = require("../controller/postController");
const verifyJWT = require("../middleware/verifyJWT");

// Public routes: anyone (logged in or unlogged in) can view posts & comments
router.route("/")
      .get(getAllPosts);

router.route("/one")
      .get(getPost);

router.route("/one/:id")
      .get(getPost);

router.route("/comment")
      .get(getComment)
      .patch(getComment);

// Protected routes: Creating, updating, commenting, liking, deleting require authentication
router.use(verifyJWT);

router.route("/")
      .post(createPost)
      .put(commentOnPost)
      .delete(deletePost);

router.route("/one")
      .post(commentOnPost);

router.route("/comment")
      .post(commentOnPost);

router.route("/like")
      .post(likePost);

module.exports = router;