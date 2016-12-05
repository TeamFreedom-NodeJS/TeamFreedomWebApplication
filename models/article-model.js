/* globals require module */

const modelRegistrator = require("./utils/model-registrator");

module.exports = modelRegistrator.register("Article", {
    title: {
        type: String,
        validate: /[а-яА-Я ]+\w /,
        required: true,
        unique: true
    },
    imgUrl: {
        type: String,
        validate: /^(ftp|http|https):\/\/[^ "]+$/,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});