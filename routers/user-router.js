"use strict";

const express = require("express");

let Router = express.Router;

module.exports = function({ app, data }) {
    let controller = require("../controllers/user-controller")(data);

    let router = new Router();

    router
        .get("/:id/myrecipes", controller.allAddedRecipes)
        .get("/:id/favorites", controller.allFavoritesRecipes)
        .post("/:id", controller.addToFavorites);

    app.use("/profile", router);

    return router;
};