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

    let data = require("../../data/article-data")({ Article });

    describe("getAllArticles", () => {
        it("Expect to return 2 articles", done => {
            // arrange
            let articles = ["Vitamini", "Minerali"];
            sinon.stub(Article, "find", cb => {
                cb(null, articles);
            });

            data.getAllArticles()
                .then(actualArticle => {
                    // assert
                    expect(actualArticle).to.eql(articles);
                    done();
                });
        });
    });

});