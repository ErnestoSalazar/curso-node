const mongoose = require("mongoose");
const dbConfig = require("../secrets/db_connection.json")[process.env.NODE_ENV || "development"];

mongoose.connect(dbConfig.MONGO_URI, {useNewUrlParser: true});

const Schema = mongoose.Schema;

module.exports = {
    mongoose,
    Schema
};