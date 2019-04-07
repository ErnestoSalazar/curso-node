const {mongoose, Schema} = require("../config/DBConnection");

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, index:{unique: true}},
    password: {type: String, required: true}
}, {timestamps:true});

/**
 * creates a User resource and retrieves it
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email
 * @param {String} password
 * @returns Promise<User>
 */
userSchema.statics.createUser = async function (firstName, lastName, email, password) {
    return await this.create({
        firstName,
        lastName,
        email,
        password
    });
}

const User = mongoose.model("User", userSchema);


module.exports = User;