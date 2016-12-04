/* globals module */
"use strict";

const DEFAULT_PAGE = 1,
    PAGE_SIZE = 10;
const NEWEST_RECIPES_COUNT = 3;

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
        cookingTimeInMinutes,
        deleted
    } = reqBody;

    categories = makeArray(categories);
    ingredientsName = makeArray(ingredientsName);
    ingredientsQuantity = makeArray(ingredientsQuantity);
    ingredientsUnits = makeArray(ingredientsUnits);
    imageUrls = makeArray(imageUrls);
    let isDeleted = !!deleted;

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
        cookingTimeInMinutes,
        isDeleted
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

            let author = req.user.profile.name || parseEmail(req.user.email);
            //console.log(author);
            data.addCommentToRecipe(content, author)
                .then(recipe => { // Todo to return json
                    req.user;
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
            let author = {
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
                    author)
                .then(recipe => {
                    req.flash("success", { msg: "Успешно регистрирахте рецептата си!" });
                    return res.redirect(/recipes/ + recipe.id);
                })
                .catch(err => {
                    req.flash("error", { msg: constants.errorMessage + err });
                    res.status(400)
                        .send(err);
                });
        },
        getNewestRecipesAjax(req, res) {
            console.log("----------- recipes ajax");
            data.getNewestRecipesAjax(NEWEST_RECIPES_COUNT)
                .then(recipes => {
                    res.send({
                        result: recipes
                            // .map(superhero => mapper.map(superhero, "_id", "name", "imageUrl"))
                    });
                });
        },
        getEditRecipeForm(req, res) {
            if (!req.isAuthenticated()) {
                return res.redirect("/");
            }

            let id = req.params.id;
            let recipe = null;
            data.getRecipeById(id)
                .then(rcp => {
                    if (!rcp || !(req.user.role === "admin" || req.user._id.equals(rcp.author.id))) {
                        throw "Recipe was not found";
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
                    res.redirect("/");

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
                cookingTimeInMinutes,
                isDeleted
            } = parseRecipeData(req.body);

            data.editRecipeById(
                    id,
                    title,
                    categories,
                    imageUrls,
                    ingredients,
                    preparation,
                    cookingTimeInMinutes,
                    isDeleted)
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
        },
        getAllRecipes(req, res) {
            let user = req.user;

            if (!req.isAuthenticated() || user.role !== "admin") {
                return res.redirect("/");
            }

            let pattern = req.query.pattern || "";
            let page = Number(req.query.page || DEFAULT_PAGE);

            data.getRecipes({ pattern, page, pageSize: PAGE_SIZE })
                .then((result => {
                    let {
                        recipes,
                        count
                    } = result;

                    if (count === 0) {
                        return res.render("recipe/recipes-list", {
                            recipes,
                            user,
                            params: { pattern, page, pages: 0 }
                        });
                    }

                    if (page < 1) {
                        return res.redirect("/recipes?page=1");
                    }

                    let pages = count / PAGE_SIZE;
                    if (parseInt(pages, 10) < pages) {
                        pages += 1;
                        pages = parseInt(pages, 10);
                    }
                    if (page > pages) {
                        page = pages;
                        return res.redirect(`/recipes?page=${page}`);
                    }

                    return res.render("recipe/recipes-list", {
                        recipes,
                        user,
                        params: { pattern, page, pages }
                    });
                }))
                .catch(err => {
                    res.status(404)
                        .send(err);
                });
        }
    };

    return controller;
};