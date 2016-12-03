/* globals module */
"use strict";

// const DEFAULT_PAGE = 1,
//     PAGE_SIZE = 10,
//     NEWEST_SUPERHEROES_COUNT = 5;

const constants = require("../config/constants");

function makeArray(item) {
    if (!Array.isArray(item)) {
        item = [item];
    }

    return item;
}

function parseRecipeData(reqBody) {
    let {
        title,
        categories,
        ingredientsName,
        ingredientsQuantity,
        ingredientsUnits,
        preparation,
        imageUrls,
        cookingTimeInMinutes
    } = reqBody;

    categories = makeArray(categories);
    ingredientsName = makeArray(ingredientsName);
    ingredientsQuantity = makeArray(ingredientsQuantity);
    ingredientsUnits = makeArray(ingredientsUnits);
    imageUrls = makeArray(imageUrls);

    let ingredients = [];
    for (let i = 0; i < ingredientsName.length; i += 1) {
        ingredients.push({
            name: ingredientsName[i],
            quantity: +ingredientsQuantity[i],
            unit: ingredientsUnits[i]
        });
    }

    return {
        title,
        categories,
        ingredients,
        preparation,
        imageUrls,
        cookingTimeInMinutes
    };
}

function parseEmail(email) {
    let index = email.indexOf("@");
    let parsed = email.substring(0, index);
    return parsed;
}

module.exports = function(data) {

    const controller = {
        getRecipeDetails(req, res) {

            let id = req.params.id;
            data.getRecipeById(id)
                .then(recipe => {
                    if (!recipe) {
                        req.flash("error", { msg: "Рецептата не е намерена!" });
                        return res.redirect("/");
                    }

                    return res.render("recipe/details", {
                        model: recipe,
                        user: req.user
                    });
                })
                .catch(err => {
                    req.flash("error", { msg: constants.errorMessage + err });
                    return res.redirect("/");
                });
        },
        addComment(req, res) {
            if (!req.isAuthenticated()) {
                req.flash("error", { msg: "Достъп до тази информация имат само регистрирани потребители!" });
                return res.redirect("/");
            }
            let id = req.params.id;
            let content = req.body.content;

            let autor = req.user.profile.name || parseEmail(req.user.email);
            //console.log(autor);
            data.addCommentToRecipe(content, autor)
                .then(recipe => { // Todo to return json
                    return res.redirect(`/recipes/${id}`);
                });
        },
        getCreateRecipeForm(req, res) {
            if (!req.isAuthenticated()) {
                return res.redirect("/");
            }

            data.getAllCategories()
                .then(categories => {
                    return res.render("recipe/create", {
                        categories,
                        user: req.user,
                        ingredients: []
                    });
                })
                .catch(err => {
                    req.flash("error", { msg: constants.errorMessage + err });
                    return res.redirect("/");
                });
        },
        createRecipe(req, res) {
            let autor = {
                id: req.user._id,
                name: req.user.profile.name || parseEmail(req.user.email),
                imageUrl: req.user.profile.picture || "no picture"
            };

            let {
                title,
                categories,
                ingredients,
                preparation,
                imageUrls,
                cookingTimeInMinutes
            } = parseRecipeData(req.body);
            return data.createRecipe(
                    title,
                    categories,
                    imageUrls,
                    ingredients,
                    preparation,
                    cookingTimeInMinutes,
                    autor)
                .then(recipe => {
                    // TO DO Delete Recipe
                    req.flash("success", { msg: "Успешно регистрирахте рецептата си!" });
                    return res.redirect(/recipes/ + recipe.id);
                })
                .catch(err => {
                    req.flash("error", { msg: constants.errorMessage + err });
                    res.status(400)
                        .send(err);
                });
        },
        getEditRecipeForm(req, res) {
            if (!req.isAuthenticated()) {
                return res.redirect("/");
            }

            let id = req.params.id;
            let recipe;
            data.getRecipeById(id)
                .then(rcp => {
                    if (!rcp) {
                        return res.redirect("/");
                    }

                    recipe = rcp;
                })
                .then(data.getAllCategories)
                .then(categories => {
                    return res.render("recipe/edit", {
                        categories,
                        recipe,
                        user: req.user,
                        units: constants.units
                    });
                })
                .catch(err => {
                    req.flash("error", { msg: constants.errorMessage + err });
                    return err;
                });
        },
        editRecipeById(req, res) {
            let id = req.params.id;
            let {
                title,
                categories,
                ingredients,
                preparation,
                imageUrls,
                cookingTimeInMinutes
            } = parseRecipeData(req.body);

            data.editRecipeById(
                    id,
                    title,
                    categories,
                    imageUrls,
                    ingredients,
                    preparation,
                    cookingTimeInMinutes)
                .then(recipe => {
                    if (!recipe) {
                        return res.redirect("/");
                    }

                    req.flash("success", { msg: "Успешно редактирахте рецептата!" });
                    return res.render("recipe/details", {
                        model: recipe,
                        user: req.user
                    });
                })
                .catch(err => {
                    req.flash("error", { msg: constants.errorMessage + err });
                    return res.redirect("/");
                });
        }
    };

    return controller;
};