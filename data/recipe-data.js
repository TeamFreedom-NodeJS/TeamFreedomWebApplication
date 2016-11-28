/* globals module require Promise */

// const dataUtils = require("./utils/data-utils");
// const mapper = require("../utils/mapper");

// const MIN_PATTERN_LENGTH = 3;
// const DELTA = 1;

module.exports = function(models) {
    let {
        Recipte
        // User,
        // Category
    } = models;

    return {
        createRecipe() {

        },
        getRecipeById(id) {
            return new Promise((resolve, reject) => {
                Recipte.findOne({ _id: id }, (err, recipe) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(recipe);
                });
            });
        }
    };
};