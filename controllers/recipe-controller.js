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
                        ingredients: [{}]
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
                ingredientsAll,
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

            let ingredients = [];
            let ingredientsArr = ingredientsAll.split(",");

            for (let i = 0; i < ingredientsArr.length; i += 1) {
                let ingredientInfo = ingredientsArr[i].split("-");
                ingredients.push({
                    name: ingredientInfo[0],
                    quantity: +ingredientInfo[1],
                    unit: ingredientInfo[2]
                });
            }

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
        editRecipeById(req, res) {
            let id = req.params.id;
            data.editRecipeById(id)
                .then(() => {
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