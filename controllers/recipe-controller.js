/* globals module */

// const DEFAULT_PAGE = 1,
//     PAGE_SIZE = 10,
//     NEWEST_SUPERHEROES_COUNT = 5;
const units = require("../config/constants").units;

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

module.exports = function(data) {
    const controller = {
        getRecipeDetails(req, res) {
            // To check if user is registered
            let id = req.params.id;
            data.getRecipeById(id)
                .then(recipe => {
                    if (!recipe) {
                        return res.redirect("/");
                    }

                    return res.render("recipe/details", {
                        model: recipe,
                        user: req.user
                    });
                })
                .catch(err => {
                    console.log("Error finding recipe by ID: " + err);
                    return res.redirect("/");
                });
        },
        addComment(req, res) {
            let id = req.params.id;
            let content = req.body.content;
            console.log(content);
            let author = "Anonimus";
            data.addCommentToRecipe(id, content, author)
                .then(recipe => {
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
                });
        },
        createRecipe(req, res) {
            let author = {
                id: req.user._id,
                name: req.user.email || req.user.profile.name,
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
                    // TO DO Delete Recipe
                    return res.redirect(`/recipes/${recipe.id}`);
                })
                .catch(err => {
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
                        units
                    });
                })
                .catch(err => {
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

                    return res.render("recipe/details", {
                        model: recipe,
                        user: req.user
                    });
                })
                .catch(err => {
                    console.log("Error finding and editing recipe by ID: " + err);
                    return res.redirect("/");
                });
        }
    };

    return controller;
};