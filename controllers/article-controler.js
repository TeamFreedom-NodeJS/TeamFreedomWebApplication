/* globals module */

module.exports = function(data) {
    return {
        createArticle(req, res) {
            let {
                title,
                imgUrl,
                content
            } = req.body;

            console.log("createArticle-controler: ", req.body);
            return data.createArticle(title, imgUrl, content)
                .then(article => {
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
                        model: articles
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
                        model: article
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getCreateArticleForm(req, res) {
            // if (!req.isAuthenticated()) {
            //     return res.redirect("/");
            // }

            return data.getAllArticles()
                .then(articles => {
                    return res.render("article/create", {
                        model: articles
                    });
                });
        },
        getEditArticleForm(req, res) {
            let id = req.params.id;

            return data.getArticleById(id)
                .then(article => {
                    res.render("article/edit", {
                        model: article
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
                        model: articles
                    });
                });
        }
        // getAllReciepsByArticle()
    };
};