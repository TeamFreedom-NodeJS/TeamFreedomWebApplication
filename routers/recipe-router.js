/* globals module require */

const express = require("express");
let Router = express.Router;

module.exports = function({ app, data }) {

    let controller = require("../controllers/recipe-controller")(data);

    let router = new Router();

    router
    // .get("/newest", controller.getNewestSuperheroesAjax)
        .get("/create", controller.getCreateRecipeForm)
        .get("/:id", controller.getRecipeDetails)
        .post("/", controller.createRecipe)
        // .post("/edit/:id", controller.createRecipe)
        .post("/:id", controller.addComment);

    app.use("/recipes", router);

    return router;
};