/* globals require module */

const modelRegistrator = require("./utils/model-registrator");

module.exports = modelRegistrator.register("Article", {
    title: {
        type: String,
        required: true,
        unique: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});