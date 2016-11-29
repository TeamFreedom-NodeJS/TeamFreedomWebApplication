/* globals module require */

const express = require("express");
let Router = express.Router;

module.exports = function({ app, data }) {

    let controller = require("../controllers/recipe-controller")(data);

    let router = new Router();

    router
    // .get("/newest", controller.getNewestSuperheroesAjax)
        .get("/:id", controller.getRecipeDetails)
        .get("/create", controller.getCreateRecipeForm)
        .post("/", controller.createRecipe);
    // .post("/update", controller.updateSuperhero);

    app.use("/recipes", router);

    return router;
};