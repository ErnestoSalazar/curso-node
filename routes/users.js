const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// router is in charge of invoke the function we pass as a reference
router.post("/", usersController.postUser);


module.exports = router;