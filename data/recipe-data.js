/* globals module require Promise */

// const dataUtils = require("./utils/data-utils");
// const mapper = require("../utils/mapper");

const MIN_PATTERN_LENGTH = 3;
// const DELTA = 1;

module.exports = function(models) {
    let {
        Recipe,
        // User,
        Category
    } = models;

    return {
        getRecipeById(id) {
            return new Promise((resolve, reject) => {
                Recipe.findOne({ _id: id }, (err, recipe) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(recipe);
                });
            });
        },
        createRecipe(title, categoriesIds, imageUrls, ingredients, preparation,
            cookingTimeInMinutes, author) {
            let recipe;

            return new Promise((resolve, reject) => {
                Category.find({ _id: { $in: categoriesIds } })
                    .select("name")
                    .exec((err, categories) => {
                        if (err) {
                            return Promise.reject(err);
                        }

                        return Promise.resolve(categories);
                    })
                    .then(categories => {
                        recipe = new Recipe({
                            title,
                            categories,
                            imageUrls,
                            ingredients,
                            preparation,
                            cookingTimeInMinutes,
                            author
                        });

                        return recipe.save(err => {
                            if (err) {
                                return err;
                            }

                            return resolve(recipe);
                        });
                    })
                    .catch(err => {
                        return reject(err);
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
        }
    };
};