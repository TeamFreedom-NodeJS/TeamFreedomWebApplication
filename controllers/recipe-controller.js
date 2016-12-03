/* globals module */

// const DEFAULT_PAGE = 1,
//     PAGE_SIZE = 10,
//     NEWEST_SUPERHEROES_COUNT = 5;

function parseRecipeData(reqBody) {
    let {
        title,
        categories,
        ingredients,
        preparation,
        imageUrls,
        cookingTimeInMinutes
    } = reqBody;

    if (!Array.isArray(categories)) {
        categories = [categories];
    }

    if (!Array.isArray(imageUrls)) {
        imageUrls = [imageUrls];
    }

    if (!Array.isArray(ingredients)) {
        ingredients = [ingredients];
    }

    let ingreds = [];
    for (let i = 0; i < ingredients.length; i += 1) {
        let ingredientInfo = ingredients[i].split("-");
        ingreds.push({
            name: ingredientInfo[0],
            quantity: +ingredientInfo[1],
            unit: ingredientInfo[2]
        });
    }

    return {
        title,
        categories,
        ingreds,
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
            // if (!req.isAuthenticated()) {
            //     return res.redirect("/");
            // }
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

            let autor = req.user.profile.name || parseEmail(req.user.email);
            data.addCommentToRecipe(id, content, autor)
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
                ingreds,
                preparation,
                imageUrls,
                cookingTimeInMinutes
            } = parseRecipeData(req.body);
            return data.createRecipe(
                    title,
                    categories,
                    imageUrls,
                    ingreds,
                    preparation,
                    cookingTimeInMinutes,
                    autor)
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
            data.getRecipeById(id)
                .then(recipe => {
                    if (!recipe) {
                        return res.redirect("/");
                    }

                    data.getAllCategories()
                        .then(categories => {
                            return res.render("recipe/edit", {
                                categories,
                                recipe,
                                user: req.user
                            });
                        })
                        .catch(err => {
                            return err;
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
                ingreds,
                preparation,
                imageUrls,
                cookingTimeInMinutes
            } = parseRecipeData(req.body);

            data.editRecipeById(
                    id,
                    title,
                    categories,
                    imageUrls,
                    ingreds,
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