/* globals require module */
"use strict";

const modelRegistrator = require("./utils/model-registrator"),
    constants = require("../config/constants.js");

module.exports = modelRegistrator.register("Recept", {
    title: {
        type: String,
        required: true
    },
    categories: [{}],
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
            type: Number,
            require: true,
            min: 1
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
        min: 1,
        max: 600,
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
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
});