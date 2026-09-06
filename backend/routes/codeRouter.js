const express = require("express");
const router = express.Router();
const { executeCode } = require("../controller/codeController");

router.post("/", executeCode);

module.exports = router;
