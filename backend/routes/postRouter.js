const express = require("express")
const router = express.Router();
const {getAllPosts ,createPost ,getPost ,commentOnPost ,getComment , deletePost} = require("../controller/postController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)

router.route("/")
      .get(getAllPosts)
      .post(createPost)
      .put(commentOnPost)
      .delete(deletePost)
      

      
router.route("/one")
      .get(getPost)
      .post(commentOnPost)


router.route("/comment")
        .post(commentOnPost)
       .patch(getComment)

module.exports = router