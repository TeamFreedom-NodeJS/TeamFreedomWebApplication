/* globals require module */

const modelRegistrator = require("./utils/model-registrator");

module.exports = modelRegistrator.register("Category", {
    name: {
        type: String,
        required: true,
        unique: true
    },
    recipes: [{}]
});