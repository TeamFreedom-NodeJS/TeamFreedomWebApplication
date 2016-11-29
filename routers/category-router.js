/* globals module require */

const express = require("express");
let Router = express.Router;

module.exports = function({
    app,
    data
}) {
    let controller = require("../controllers/category-controler")(data);

    let router = new Router();

    router
        .get("/", controller.getAllCategories)
        .get("/:id", controller.getCategoryById);

    app.use("/categories", router);

    return router;
};