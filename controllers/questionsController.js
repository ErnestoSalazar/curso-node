"use strict";

const Question = require("../models/Question");


/**
 * returns all questions in our application
 * @param {*} req 
 * @param {*} res 
 */
const getQuestions = async (req, res) => {
    const questions = await Question.findAll();
    res.json(questions);
};

/**
 * returns a single Question resource by a given id
 * @param {*} req 
 * @param {*} res 
 */
const getQuestion = async (req, res) => {
    const {id} = req.params;
    const question = await Question.findOne({_id: id});
    res.json(question);
};

/**
 * creates a new Question resource
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const postQuestion = async (req, res, next) => {
    try {
        const {title, description} = req.body;
        const user = req.user;

        const question = await Question.createQuestion(title, description, user);

        res.status(201);
        res.json(question);
    }
    catch (e) {
        next(e);
    }
};

/**
 * deletes a Question for a given id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteQuestion = async (req, res, next) => {
    try{
        const {id} = req.params;

        const result = await Question.deleteOne({_id: id});
        if (result.n) {
            res.status(204);
            res.send();
        }
        else {
            res.status(404);
            res.send();
        }
    } catch (e) {
        next(e);
    }
};


/**
 * creates and adds an answer to a given question
 * @param {*} req 
 * @param {*} res 
 */
const postAnswer = async (req, res) => {
    const {id} = req.params;
    const {answer} = req.body;
    const user = req.user;

    const question = await Question.findOne({_id: id})

    const result = await Question.update({_id: id}, {
        $push: {
            answers: {
                user,
                answer,
                points: 0
            }
        }
    });

    if (result.nModified) {
        res.status(201);
        res.json({
            message: "answer created"
        });
    }
    else {
        res.status(200);
        res.json({
            message: "no model updated"
        });
    }
};


/**
 * updates the points of an answer for a given question
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const voteQuestion = async (req, res, next) => {
    const {id, aId, vote} = req.params;
    const question = await Question.findOne({_id: id});
    const answer = question.answers.find((answer) => answer._id.toString() === aId);

    if (answer) {
        if (vote === "up") {
            answer.points += 1;
        }
        else if (vote === "down") {
            answer.points -= 1;
        }
        await question.save();
        res.json(answer);
    }
    else {
        res.status(401);
        res.json({
            message: "The answer does not exists"
        });
    }
};


module.exports = {
    getQuestions,
    getQuestion,
    postQuestion,
    deleteQuestion,
    postAnswer,
    voteQuestion
}