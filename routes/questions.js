const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");

router.get("/", questionsController.getQuestions);

router.get("/:id", questionsController.getQuestion);

router.post("/", questionsController.postQuestion);

router.delete("/:id", questionsController.deleteQuestion);

router.post('/:id/answers', questionsController.postAnswer);

router.put("/:id/answers/:aId/vote-:vote", questionsController.voteQuestion);

module.exports = router;