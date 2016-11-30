/* globals require module */

const modelRegistrator = require("./utils/model-registrator");

module.exports = modelRegistrator.register("User", {
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    salt: String,
    passHash: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    tokens: Array,

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });