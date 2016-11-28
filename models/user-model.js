/* globals require module */

const modelRegistrator = require("./utils/model-registrator");

module.exports = modelRegistrator.register("User", {
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    passHash: {
        type: String,
        required: true
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});