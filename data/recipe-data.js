/* globals module require Promise */

// const dataUtils = require("./utils/data-utils");
// const mapper = require("../utils/mapper");

// const MIN_PATTERN_LENGTH = 3;
// const DELTA = 1;

module.exports = function(models) {
    let {
        Recipe
        // User,
        // Category
    } = models;

    return {
        createRecipe(title, categories, imageUrls, ingredients, preparation,
            cookingTimeInMinutes, author, comments) {

            let recipe = new Recipe({
                title,
                categories,
                imageUrls,
                ingredients,
                preparation,
                cookingTimeInMinutes,
                author,
                comments
            });

            console.log(ingredients);
            return new Promise((resolve, reject) => {
                recipe.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(recipe);
                });
            });
        },
        getRecipeById(id) {
            return new Promise((resolve, reject) => {
                Recipe.findOne({ _id: id }, (err, recipe) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(recipe);
                    return resolve(recipe);
                });
            });
        }

        // getRecipeByTitle(title) {
        //     return new Promise((resolve, reject) => {
        //         Recipe.find({ title: title }, (err, recipe) => {
        //             if (err) {
        //                 return reject(err);
        //             }
        //             return resolve(recipe);
        //         });
        //     });
        // }

    };
};