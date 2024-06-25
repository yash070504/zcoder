const express = require('express');
const router = express.Router();
const promblemController = require('../controller/promblemController')
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)

router.route('/')
   .get(promblemController.getAllPromblem)
    .post(promblemController.postPromblem)
    .delete(promblemController.deletePromblem) 
    .patch(promblemController.updatePromblem)
    module.exports = router;