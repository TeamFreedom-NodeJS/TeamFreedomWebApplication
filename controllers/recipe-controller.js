/* globals module */

// const mapper = require("../utils/mapper");

// const DEFAULT_PAGE = 1,
//     PAGE_SIZE = 10,
//     NEWEST_SUPERHEROES_COUNT = 5;

module.exports = function(data) {
    const controller = {
        getRecipeDetails(req, res) {
            // To check if user is registered
            let id = req.params.id;
            data.getRecipeById(id)
                .then(recipe => {
                    return res.render("recipe/details", {
                        model: recipe,
                        user: req.user
                    });
                });
        },
        // getRecipeDetailsTitle(req, res) {
        //     // To check if user is registered
        //     let title = req.params.title;
        //     data.getRecipeByTitle(title)
        //         .then(recipe => {
        //             return res.render("recipe/details", {
        //                 model: recipe,
        //                 user: req.user
        //             });
        //         });
        // },

        getCreateRecipeForm(req, res) {
            if (!req.isAuthenticated()) {
                return res.redirect("/");
            }
            return res.render("recipe/create", {

                // TO DO: Get Categories from DB
                categories: [{
                    id: 1,
                    name: "Салати"
                }, {
                    id: 2,
                    name: "Мезета"
                }],
                user: req.user
            });
        },
        createRecipe(req, res) {
            let comments = [],
                author = {
                    id: req.user._id,
                    name: req.user.username
                };
            let {
                title,
                categories,
                ingredients,
                preparation,
                imageUrls,
                cookingTimeInMinutes
            } = req.body;

            if (!Array.isArray(categories)) {
                categories = [categories];
            }

            if (!Array.isArray(imageUrls)) {
                imageUrls = [imageUrls];
            }

            if (!Array.isArray(ingredients)) {
                ingredients = [ingredients];
            }

            if (!Array.isArray(comments)) {
                comments = [comments];
            }

            return data.createRecipe(
                    title,
                    categories,
                    imageUrls,
                    ingredients,
                    preparation,
                    cookingTimeInMinutes,
                    author,
                    comments)
                .then(recipe => {
                    return res.redirect(`/recipes/${recipe.id}`);
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        }
    };

    return controller;
};