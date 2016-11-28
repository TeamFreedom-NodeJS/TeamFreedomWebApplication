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
        }
    };
    return controller;
};