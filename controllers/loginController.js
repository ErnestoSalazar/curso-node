"use strict";
const Authentication = require("../config/Authentication");

const jwt = require("jsonwebtoken");
const secretKey = require("../secrets/authentication_token.json").secretToken;

const login = async (req, res, next) => {
    /**
     * We call our authentication function
     * and pass a callback function that will be executed when authenticateUser is finished
     */
    Authentication.authenticateUser(req, (error, user) => {
        if (error) return next(error);

        const token = jwt.sign({_id: user._id}, secretKey); // we create a token that is going to be sent to the user

        res.json({
            token
        });
    });
};

module.exports = {
    login
}