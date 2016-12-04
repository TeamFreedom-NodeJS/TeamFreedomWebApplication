/* globals module require */

const express = require("express");
let Router = express.Router;

module.exports = function({
    app,
    data
}) {
    let controller = require("../controllers/article-controler")(data);

    let router = new Router();

    router
        .get("/list", controller.getAllArticles)
        .get("/create", controller.getCreateArticleForm)
        .get("/newest", controller.getNewestArticlesAjax)
        .post("/", controller.createArticle)
        .put("/edit", controller.getEditArticleForm)
        .put("/edit/:id", controller.editArticleById)
        .get("/:id", controller.getArticleById);

    app.use("/articles", router);

    return router;
};