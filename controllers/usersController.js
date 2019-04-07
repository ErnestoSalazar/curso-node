"use strict";
const User = require("../models/User");

/**
 * Creates a new User resource and returns a response to client
 * @param {*} req 
 * @param {*} res 
 */
const postUser = async (req, res, next) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        const user = await User.createUser(firstName, lastName, email, password);
        res.status(201);
        res.json(user);
    } catch (e) {
        next(e);
    }
};


module.exports = {
    postUser
};