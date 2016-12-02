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
                    console.log("in function", actualarticles);
                    expect(actualarticles).to.eql([]);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });

            sinon.restore();
        });

        it("Expect to return 1 articles", done => {
            let articles = ["Предястия"];
            sinon.stub(Article, "find", (_, cb) => {
                cb(null, articles);
            });

            // act
            data.getAllArticles()
                .then(actualarticles => {
                    // assert
                    console.log("test1-2", actualarticles);

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
                    console.log("---test2", actualArticle);
                    expect(actualArticle).to.equal(null);
                    done();
                }));
        });


    });

    describe("editArticleById", () => {

    });

    describe("createArticle", () => {

    });
});