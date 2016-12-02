/* globals require module */

const modelRegistrator = require("./utils/model-registrator");
const constants = require("../config/constants");

module.exports = modelRegistrator.register("Recept", {
    title: {
        type: String,
        required: true
    },
    categories: [{}],
    // to do custom validator
    imageUrls: {
        type: [{}],
        limit: 3,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number
        },
        unit: {
            type: String,
            enum: constants.units
        }
    }],
    preparation: {
        type: String,
        required: true,
        min: 10,
        max: 2000
    },
    cookingTimeInMinutes: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {},
    comments: [{
        author: {},
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        content: {
            type: String,
            required: true,
            min: 10,
            max: 200
        }
    }]
});