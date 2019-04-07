"use strict";

const jwt = require("jsonwebtoken");
const secretToken = require("../secrets/authentication_token.json").secretToken;

const User = require("../models/User");

/**
 * Search if a user exists in the data base
 * if exists: return User
 * else: return Error
 * @param {*} req 
 * @param {Function} callback 
 */
const authenticateUser = async (req, callback) => {
    const {email, password} = req.body;
    const user = await User.findOne({email, password});

    if (user) {
        return callback(null, user);
    }
    else {
        const error = new Error("unauthorized");
        error.status = 401;
        return callback(error, null);
    }
};

/**
 * we verify if the user has a valid token to use the API
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkIfUserExists = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, secretToken, async function (error, decoded) {
        if (error){
            const error = new Error("unauthorized");
            error.status = 401;
            return next(error);
        } 
        const user = await User.findOne({_id: decoded._id});
        if (user) {
            req.user = user;
            next();
        }
    });
};


module.exports = {
    authenticateUser,
    checkIfUserExists
}