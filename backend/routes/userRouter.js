const express  = require('express');
const {getAllUser ,
  createNewUser,
  updateUser ,  
  deleteUser,}  = require('../controller/userController')
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT')

router.route("/")
   .post(createNewUser)
   


router.route("/")
.get(getAllUser,verifyJWT)
.patch(updateUser,verifyJWT)
.delete(deleteUser,verifyJWT)



module.exports = router ;