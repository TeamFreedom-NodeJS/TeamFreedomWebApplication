/* globals module require Promise */

const MIN_PATTERN_LENGTH = 3;

module.exports = function(models) {
    let {
        Recipe,
        //User,
        Category
    } = models;

    function findCategoriesByIds(categoriesIds) {
        return new Promise((resolve, reject) => {
            Category.find({ _id: { $in: categoriesIds } })
                .select("name")
                .then(categories => {
                    let recipeCategories = [];

                    for (let categ of categories) {
                        let categInRecipe = {
                            name: categ.name,
                            id: categ._id
                        };

                        recipeCategories.push(categInRecipe);
                    }

                    return resolve(recipeCategories);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    function addRecipeToCategories(categoriesIds, recipe) {
        return new Promise((resolve, reject) => {
            if (categoriesIds[0]) {
                let recipeInfo = {
                    id: recipe._id,
                    title: recipe.title,
                    imageUrl: recipe.imageUrls[0]
                };

                categoriesIds.forEach(categId => {
                    Category.findByIdAndUpdate(
                        categId, { $push: { recipes: recipeInfo } }, { safe: true },
                        err => {
                            if (err) {
                                console.log(err);
                                return reject(err);
                            }
                        });
                });
            }

            return resolve(recipe);
        });
    }

    function removeRecipeFromItsCategories(recipe) {
        return new Promise((resolve, reject) => {
            recipe.categories.forEach(categ => {
                Category.findByIdAndUpdate(
                    categ.id, { $pull: { recipes: { id: recipe._id } } }, { safe: true, new: true },
                    (err, c) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }
                    });
            });

            return resolve(recipe);
        });
    }

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
        addCommentToRecipe(id, content, author) {
            return new Promise((resolve, reject) => {
                let newComment = {
                    content,
                    author: { username: author }
                };

                Recipe.findByIdAndUpdate(id, { $push: { comments: newComment } }, { safe: true, upsert: true }, (err, recipe) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(recipe);
                });
            });
        },
        createRecipe(title, categoriesIds, imageUrls, ingredients, preparation,
            cookingTimeInMinutes, author) {

            return new Promise((resolve, reject) => {
                findCategoriesByIds(categoriesIds)
                    .then(categories => {
                        let recipe = new Recipe({
                            title,
                            categories,
                            imageUrls,
                            ingredients,
                            preparation,
                            cookingTimeInMinutes,
                            author
                        });

                        return new Promise((resolve, reject) => {
                            recipe.save(err => {
                                if (err) {
                                    return reject(err);
                                }

                                return resolve(recipe);
                            });
                        });
                    })
                    .then(recipe => {
                        addRecipeToCategories(categoriesIds, recipe)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        editRecipeById(id, title, categoriesIds, imageUrls, ingredients, preparation,
            cookingTimeInMinutes) {
            return new Promise((resolve, reject) => {
                Recipe.findById(id, (err, recipe) => {
                        if (err) {
                            console.log(err);
                            return err;
                        }

                        return recipe;
                    })
                    .then(removeRecipeFromItsCategories)
                    .then(() => {
                        findCategoriesByIds(categoriesIds)
                            .then(categories => {
                                return new Promise((resolve, reject) => {
                                    Recipe.findByIdAndUpdate(id, {
                                            title,
                                            categories,
                                            imageUrls,
                                            ingredients,
                                            preparation,
                                            cookingTimeInMinutes
                                        }, { safe: true, new: true },
                                        (err, recipe) => {
                                            if (err) {
                                                console.log(err);
                                                return reject(err);
                                            }

                                            return resolve(recipe);
                                        });
                                });
                            })
                            .then(recipe => {
                                addRecipeToCategories(categoriesIds, recipe)
                                    .then(resolve)
                                    .catch(reject);
                            })
                            .catch(err => {
                                return reject(err);
                            });
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