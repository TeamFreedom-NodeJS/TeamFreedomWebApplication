/* globals require describe it beforeEach afterEach*/
"use strict";

const chai = require("chai");
const sinonModule = require("sinon");

let expect = chai.expect;

describe("Test recipe data", () => {
    const SOME_RECIPE_ID = "some_unique_recipe_ID";
    const SOME_RECIPE_TITLE = "some_recipe_TITLE";
    const SOME_RECIPE_IMAGE_URL = "some_recipe_URL";

    let sinon;

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Recipe {
        constructor(properties) {
            this._id = properties.id;
            this.title = properties.title;
            this.imgUrl = properties.imgUrl;
        }

        save() {}

        static findById() {}
    }

    let data = require("../../data/recipe-data")({
        Recipe
    });

    describe("getRecipeById", () => {
        let recipe = {
            _id: SOME_RECIPE_ID,
            title: SOME_RECIPE_TITLE,
            imgUrl: SOME_RECIPE_IMAGE_URL
        };

        let recipes = [recipe];

        beforeEach(() => {
            sinon.stub(Recipe, "findById", (id, cb) => {
                let actualRecipe = recipes.find(r => r._id === id);
                if (!actualRecipe) {
                    cb(null, null);
                }

                cb(null, actualRecipe);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the right recipe when found", done => {
            data.getRecipeById(SOME_RECIPE_ID)
                .then((actualRecipe => {
                    expect(actualRecipe).to.equal(recipe);
                    done();
                }))
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return null, when no such recipe has been found", done => {
            data.getRecipeById(2)
                .then((actualRecipe => {
                    expect(actualRecipe).to.equal(null);
                    done();
                }))
                .catch(err => {
                    console.log(err);
                });
        });
    });

    // describe("createRecipe", () => {
    //     it("Expect to save the right recipe", done => {
    //         // arrange
    //         let id = SOME_RECIPE_ID,
    //             title = SOME_RECIPE_TITLE,
    //             imgUrl = SOME_RECIPE_IMAGE_URL,
    //             recipes = [];

    //         sinon.stub(Recipe.prototype, "save", (id, title, imgUrl, cb) => {
    //             let recipe = {
    //                 _id: id,
    //                 title,
    //                 imgUrl
    //             };
    //             recipes.push(recipe);
    //             cb(null, recipe);
    //         });

    //         // act
    //         data.createRecipe()
    //             .then(actualRecipe => {
    //                 // assert
    //                 expect(actualRecipe).to.eql(recipes[0]);
    //                 done();
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     });
    // });
});