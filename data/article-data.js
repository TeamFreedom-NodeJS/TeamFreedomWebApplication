/* globals module require Promise */

const dataUtils = require("./utils/data-utils");

const MIN_PATTERN_LENGTH = 3;

module.exports = function(models) {
    let {
        Article
    } = models;

    return {
        createArticle(name, imgUrl, content) {
            return dataUtils.loadOrCreateArticle(Article, name, imgUrl, content);
        },
        getAllArticles() {
            return new Promise((resolve, reject) => {
                Article.find()
                    .exec((err, articles) => {
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

                    return resolve(article);
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
                        if(newImgUrl) {
                            article.imgUrl = newImgUrl;
                        }

                        return resolve(article);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        }
    };
};