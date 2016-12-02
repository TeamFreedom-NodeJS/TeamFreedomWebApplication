/* globals module require Promise */

const dataUtils = require("./utils/data-utils");

const MIN_PATTERN_LENGTH = 3;

module.exports = function(models) {
    let {
        Article
    } = models;

    return {
        createArticle(title, imgUrl, content) {
            let article = new Article({ title, imgUrl, content });
            if (3 > title.length || title.length > 50 ) {
                console.log("--------------ïnvalid title length.", title.length);
                return Promise.reject({ reason: "Title must be between 3 and 50 characters long." });
            }
            
            if (3 > imgUrl.length) {
                console.log("--------------ïnvalid imgUrl length.", imgUrl.length);
                return Promise.reject({ reason: "Image url must be bigger than 3 charecters long." });
            }

            if (3 > content.length || content.length > 500) {
                console.log("--------------ïnvalid content length.", content.length);
                return Promise.reject({ reason: "Content length must be between 3 and 500 characters long." });
            }

            return new Promise((resolve, reject) => {
                article.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(article);
                });
            });
        },
        getAllArticles() {
            return new Promise((resolve, reject) => {
                Article.find({}, (err, articles) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(articles);
                });
            });
        },
        getArticleByName(name) {
            return new Promise((resolve, reject) => {
                Article.findOne({
                    name
                }, (err, article) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(article);
                });
            });
        },
        getArticleById(id) {
            return new Promise((resolve, reject) => {
                Article.findOne({
                    _id: id
                }, (err, article) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(article || null);
                });
            });
        },
        editArticleById(id, newName, newImgUrl) {
            return new Promise((resolve, reject) => {
                this.getArticleById(id)
                    .then(article => {
                        if (newName) {
                            article.name = newName;
                        }
                        if (newImgUrl) {
                            article.imgUrl = newImgUrl;
                        }

                        return resolve(article);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        save(model) {
            return new Promise((resolve, reject) => {
                model.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(model);
                });
            });
        }
    };
};