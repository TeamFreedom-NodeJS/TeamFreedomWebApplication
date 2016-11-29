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

        searchRecipes({ pattern, page, pageSize }) {
            let query = {};
            if (typeof pattern === "string" && pattern.length >= MIN_PATTERN_LENGTH) {
                query.$or = [{
                    title: new RegExp(`.*${pattern}.*`, "gi")
                }, {
                    category: new RegExp(`.*${pattern}.*`, "gi")
                }];
            }

            let skip = (page - 1) * pageSize,
                limit = page * pageSize;

            return new Promise((resolve, reject) => {
                Recipe.find()
                    .where(query)
                    .skip(skip)
                    .limit(limit)
                    .exec((err, recipes) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(recipes || []);
                    });
            });
},

        getRecipeById(id) {
            return new Promise((resolve, reject) => {
                Recipe.findOne({ _id: id }, (err, recipe) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(recipe);
                });
            });
        }
    };
};