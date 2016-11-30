/* globals module require */

const express = require("express");
let Router = express.Router;

module.exports = function({ app, data }) {

    let controller = require("../controllers/recipe-controller")(data);

    let router = new Router();

    router
    // .get("/newest", controller.getNewestSuperheroesAjax)
        .get("/create", controller.getCreateRecipeForm)
        .post("/", controller.createRecipe)
        .get("/:id", controller.getRecipeDetails);
    // .post("/update", controller.updateSuperhero);

    app.use("/recipes", router);

    return router;
};