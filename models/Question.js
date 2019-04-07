const {mongoose, Schema} = require("../config/DBConnection");

/**
 * Creates a schema / definition of our model
 */
const questionSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User"},
    answers: [{
        user: {type: Schema.Types.ObjectId, ref: "User"},
        answer: {type: String},
        points: {type: Number, default: 0}
    }]
}, {timestamps: true});


/**
 * Return all questions and the reference to other models from other collections
 */
questionSchema.statics.findAll = async function () {
    return await this.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$answers",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "answers.user",
                foreignField: "_id",
                as: "answers.user"
            }
        },
        {
            $group: {
                _id: "$_id",
                question: {$first: "$title"},
                description: {$first: "$description"},
                user: {$first: "$user"},
                answers: {$push: "$answers"},
                createdAt: {$first: "$createdAt"},
                updatedAt: {$first: "$updatedAt"},
            }
        }
    ]);
};


/**
 * creates a new Question resource and retrieves it
 * @param {String} title
 * @param {String} description
 * @param {User} user
 */
questionSchema.statics.createQuestion = async function (title, description, user) {
    return await this.create({
        title,
        description,
        user
    });
};

const Question = mongoose.model("Question", questionSchema);


module.exports = Question;