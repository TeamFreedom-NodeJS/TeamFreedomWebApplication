/* globals module */
"use strict";

const NEWEST_ARTICLES_COUNT = 4;

module.exports = function(data) {
    return {
        createArticle(req, res) {
            if (!req.isAuthenticated()) {
                return res.redirect("/");
            }
            let {
                title,
                imgUrl,
                content
            } = req.body;

            return data.createArticle(title, imgUrl, content)
                .then(article => {
                    console.log("in create controler", article);
                    return res.redirect("/articles/create");
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getAllArticles(req, res) {
            data.getAllArticles()
                .then(articles => {
                    return res.render("article/all", {
                        model: articles,
                        user: req.user
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getArticleByName(req, res) {
            let title = req.params.title;
            return data.getArticleByName(title)
                .then(article => {
                    res.send(article);
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getArticleById(req, res) {
            let id = req.params.id;

            return data.getArticleById(id)
                .then(article => {
                    return res.render("article/details", {
                        model: article,
                        user: req.user
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getNewestArticlesAjax(req, res) {
            data.getNewestArticles(NEWEST_ARTICLES_COUNT)
                .then(articles => {
                    res.send({
                        result: articles
                    });
                });
        },
        getCreateArticleForm(req, res) {
            // if (!req.isAuthenticated()) {
            //     return res.redirect("/");
            // }

            return data.getAllArticles()
                .then(articles => {
                    return res.render("article/create", {
                        model: articles,
                        user: req.user
                    });
                });
        },
        getEditArticleForm(req, res) {
            let id = req.params.id;

            return data.getArticleById(id)
                .then(article => {
                    res.render("article/edit", {
                        model: article,
                        user: req.user
                    });
                });
        },
        editArticleById(req, res) {
            let {
                id,
                newName,
                newImgUrl
            } = req.body;

            return data.editArticleById(id, newName, newImgUrl)
                .then(articles => {
                    return res.render("article/create", {
                        model: articles,
                        user: req.user
                    });
                });
        }
    };
};