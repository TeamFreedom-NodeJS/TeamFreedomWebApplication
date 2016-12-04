/* globals require describe it beforeEach afterEach*/
"use strict";

const chai = require("chai");
const sinonModule = require("sinon");

let expect = chai.expect;

describe("Test articles data", () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Article {
        constructor(propeties) {
            this.title = propeties.title;
            this.imgUrl = propeties.imgUrl;
            this.content = propeties.content;
        }

        save() {

        }

        static find() {}
        static findOne() {}
    }

    let data = require("../../data/article-data")({
        Article
    });

    describe("getAllArticles", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return empty array if there is not articles", done => {
            let articles = [];
            sinon.stub(Article, "find", (_, cb) => {
                cb(null, articles);
            });

            // act
            data.getAllArticles()
                .then(actualarticles => {
                    // assert
                    expect(actualarticles).to.eql([]);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return 1 article", done => {
            let articles = ["Предястия"];
            sinon.stub(Article, "find", (_, cb) => {
                cb(null, articles);
            });

            // act
            data.getAllArticles()
                .then(actualarticles => {
                    // assert
                    expect(actualarticles).to.eql(articles);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return 2 articles", done => {
            // arrange
            let articles = ["Предястие", "Основно ястие"];
            sinon.stub(Article, "find", (_, cb) => {
                cb(null, articles);
            });

            // act
            data.getAllArticles()
                .then(actualarticles => {
                    // assert
                    expect(actualarticles).to.eql(articles);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });

    describe("getArticleById", () => {
        let existingArticleId = 1;

        let article = {
            _id: existingArticleId,
            name: "Предястие"
        };

        let articles = [article];

        beforeEach(() => {
            sinon.stub(Article, "findOne", (query, cb) => {
                let id = query._id;
                let foundArticle = articles.find(fr => fr._id === id);
                cb(null, foundArticle);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the article", done => {
            data.getArticleById(existingArticleId)
                .then((actualArticle => {
                    expect(actualArticle).to.equal(article);
                    done();
                }))
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return null, when no article with the id", done => {
            data.getArticleById(2)
                .then((actualArticle => {
                    expect(actualArticle).to.equal(null);
                    done();
                }));
        });
    });

    describe("createArticle", () => {
        beforeEach(() => {
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to save the Article, when valid parameters", done => {
            let title = "Зaглавие";
            let imgUrl = "URL-1";
            let content = "Съдържание";

            data.createArticle(title, imgUrl, content)
                .then(actualArticle => {
                    expect(actualArticle.title).to.equal(title);
                    expect(actualArticle.imgUrl).to.equal(imgUrl);
                    expect(actualArticle.content).to.equal(content);
                    done();
                });
        });

        // ----------- title ----------------
        it("Expect to fail, when title is empty", done => {
            let title = "";
            let imgUrl = "URL";
            let content = "Съдържание";

            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when title length is 2 characters long", done => {
            let title = "AA";
            let imgUrl = "URL";
            let content = "Съдържание";

            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when title length is 51 characters long", done => {
            let title = "A".repeat(51);
            let imgUrl = "URL";
            let content = "Съдържание";

            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        // ------------------ imgUrl ------------------------

        it("Expect to fail, when imgUrl is empty", done => {
            let title = "Зaглавие";
            let imgUrl = "";
            let content = "Съдържание";
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when imgUrl is 2 characters long", done => {
            let title = "Зaглавие";
            let imgUrl = "AA";
            let content = "Съдържание";
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        //------------------- content --------------------

        it("Expect to fail, when content is empty", done => {
            let title = "Зaглавие";
            let imgUrl = "Url-1";
            let content = "";
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when imgUrl is 2 characters long", done => {
            let title = "Зaглавие";
            let imgUrl = "Url-1";
            let content = "AA";
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when imgUrl is 10001 characters long", done => {
            let title = "Зaглавие";
            let imgUrl = "Url-1";
            let content = "A".repeat(10001);
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        describe("editArticleById", () => {
            let existingArticleId = 1;
            let existingArticleTitle = "Предястие-1";
            let existingArticleImgUrl = "ImgUrl-1";
            let existingArticleContent = "Content-1";

            let article = {
                _id: existingArticleId,
                title: existingArticleTitle,
                imgUrl: existingArticleImgUrl,
                content: existingArticleContent
            };

            let articles = [article];

            beforeEach(() => {
                sinon.stub(Article, "findOne", (query, cb) => {
                    let id = query._id;
                    let foundArticle = articles.find(fr => fr._id === id);
                    cb(null, foundArticle);
                });
            });

            afterEach(() => {
                sinon.restore();
            });

            it("Expect to edit this article, when valid parameters", done => {
                let newArticleId = 1;
                let newArticleTitle = "Предястие-1";
                let newArticleImgUrl = "ImgUrl-1";
                let newArticleContent = "Content-1";

                data.editArticleById(
                        newArticleId,
                        newArticleTitle,
                        newArticleImgUrl,
                        newArticleContent)
                    .then(editedArticle => {
                        expect(editedArticle._id).to.equal(article._id);
                        expect(editedArticle.title).to.equal(newArticleTitle);
                        expect(editedArticle.imgUrl).to.equal(newArticleImgUrl);
                        expect(editedArticle.content).to.equal(newArticleContent);
                        done();
                    });
            });

            // err if invalid parameters
        });
    });
});