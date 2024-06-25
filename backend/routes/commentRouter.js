const express = require("express")
const router = express.Router();
const {getAllPosts ,createPost ,getPost ,commentOnPost ,getComment} = require("../controller/postController")

router.route("/")
      .post(commentOnPost)
      

module.exports = router