/* globals module require Promise */
"use strict";

const MIN_PATTERN_LENGTH = 3;

module.exports = function(models) {
    let {
        Recipe,
        User,
        Category
    } = models;

    function addRecipeToUser(userId, recipe) {
        return new Promise((resolve, reject) => {
            if (!recipe || recipe.isDeleted) {
                console.log("isDeleted recipe NOT added to author");
                return resolve(recipe);
            }

            let recipeInfo = {
                id: recipe._id,
                title: recipe.title,
                imageUrl: recipe.imageUrls[0]
            };

            User.findByIdAndUpdate(
                userId, {
                    $push: {
                        addedRecipes: recipeInfo
                    }
                }, {
                    safe: true
                },
                err => {
                    if (err) {
                        return reject(err);
                    }
                });

            console.log("added to author");
            return resolve(recipe);
        });
    }

    function findRecipeInAuthorAndDelete(recipe) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(
                recipe.author.id, {
                    $pull: {
                        addedRecipes: {
                            id: recipe._id
                        }
                    },
                }, {
                    safe: true
                },
                err => {
                    if (err) {
                        return reject(err);
                    }
                });

            console.log("deleted from author");
            return resolve(recipe);
        });
    }

    function findCategoriesByIds(categoriesIds) {
        return new Promise((resolve, reject) => {
            Category.find({
                    _id: {
                        $in: categoriesIds
                    }
                })
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
            if (!recipe || recipe.isDeleted) {
                console.log("isDeleted recipe NOT added to categs");
                return resolve(recipe);
            }

            if (categoriesIds[0]) {
                let recipeInfo = {
                    id: recipe._id,
                    title: recipe.title,
                    imageUrl: recipe.imageUrls[0]
                };

                categoriesIds.forEach(categId => {
                    Category.findByIdAndUpdate(
                        categId, {
                            $push: {
                                recipes: recipeInfo
                            }
                        }, {
                            safe: true
                        },
                        err => {
                            if (err) {
                                return reject(err);
                            }
                        });
                });
            }

            console.log("added to categs");
            return resolve(recipe);
        });
    }

    function removeRecipeFromItsCategories(recipe) {
        return new Promise((resolve, reject) => {
            recipe.categories.forEach(categ => {
                Category.findByIdAndUpdate(
                    categ.id, {
                        $pull: {
                            recipes: {
                                id: recipe._id
                            }
                        }
                    }, {
                        safe: true,
                        new: true
                    },
                    err => {
                        if (err) {
                            return reject(err);
                        }
                    });
            });

            console.log("deleted from categs");
            return resolve(recipe);
        });
    }

    return {
        getRecipeById(id) {
            return new Promise((resolve, reject) => {
                Recipe.findById(id, (err, recipe) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!recipe || recipe.isDeleted) {
                        return resolve(null);
                    }

                    return resolve(recipe);
                });
            });
        },
        addCommentToRecipe(content, author, id) {
            return new Promise((resolve, reject) => {
                let newComment = {
                    content: content,
                    author: author
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
                        return addRecipeToCategories(categoriesIds, recipe);
                    })
                    .then(recipe => {
                        return addRecipeToUser(author.id, recipe);
                    })
                    .then(recipe => {
                        return resolve(recipe);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        getNewestRecipesAjax(count) {
            return new Promise((resolve, reject) => {
                Recipe.find({})
                    .sort({
                        createdAt: -1
                    })
                    .limit(count)
                    .exec((err, recipes) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(recipes);
                    });
            });
        },
        editRecipeById(id, title, categoriesIds, imageUrls, ingredients, preparation,
            cookingTimeInMinutes, isDeleted) {
            let updatedRecipe;

            return new Promise((resolve, reject) => {
                Recipe.findById(id, (err, recipe) => {
                        if (err) {
                            return err;
                        }

                        return recipe;
                    })
                    .then(removeRecipeFromItsCategories)
                    .then(() => {
                        return findCategoriesByIds(categoriesIds);
                    })
                    .then(categories => {
                        return new Promise((resolve, reject) => {
                            Recipe.findByIdAndUpdate(id, {
                                    title,
                                    categories,
                                    imageUrls,
                                    ingredients,
                                    preparation,
                                    cookingTimeInMinutes,
                                    isDeleted
                                }, {
                                    safe: true,
                                    new: true
                                },
                                (err, recipe) => {
                                    if (err) {
                                        return reject(err);
                                    }

                                    updatedRecipe = recipe;
                                    return resolve(recipe);
                                });
                        });
                    })
                    .then(recipe => {
                        return addRecipeToCategories(categoriesIds, recipe);
                    })
                    .then(findRecipeInAuthorAndDelete)
                    .then(() => {
                        return addRecipeToUser(updatedRecipe.author.id, updatedRecipe);
                    })
                    .then(recipe => {
                        return resolve(recipe);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        getRecipes({ page, pageSize }) {
            let skip = (page - 1) * pageSize,
                limit = page * pageSize;

            return Promise.all([
                new Promise((resolve, reject) => {
                    Recipe.find()
                        .sort({ title: 1 })
                        .skip(skip)
                        .limit(limit)
                        .exec((err, recipes) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(recipes);
                        });
                }), new Promise((resolve, reject) => {
                    Recipe.count({})
                        .exec((err, count) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(count);
                        });
                })
            ]).then(results => {
                let [recipes, count] = results;
                return { recipes, count };
            });
        },
        searchRecipes({
            pattern,
            page,
            pageSize
        }) {
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