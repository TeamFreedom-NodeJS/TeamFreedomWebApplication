/* globals require describe it beforeEach afterEach*/

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

            sinon.restore();
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

            sinon.restore();
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

            sinon.restore();
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

        // it("Expect to throw if input is json or other", done => {
        //     expect(1).to.eql(2);
        // });


    });

    describe("createArticle", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("Expect to save the Article, when valid parameters", done => {
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

            let title = "Зaглавие";
            let imgUrl = "URL-1";
            let content = "Съдържание";

            data.createArticle(title, imgUrl, content)
                .then(actualArticle => {
                    expect(actualArticle.title).to.equal(title);
                    done();
                });
        });

        // ----------- title ----------------
        it("Expect to fail, when title is empty", done => {
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

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
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

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
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

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
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

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
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

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
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

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
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

            let title = "Зaглавие";
            let imgUrl = "Url-1";
            let content = "AA";
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when imgUrl is 501 characters long", done => {
            sinon.stub(Article.prototype, "save", cb => {
                cb(null);
            });

            let title = "Зaглавие";
            let imgUrl = "Url-1";
            let content = "A".repeat(501);
            data.createArticle(title, imgUrl, content)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        describe("editArticleById", () => {

        });
    });
});