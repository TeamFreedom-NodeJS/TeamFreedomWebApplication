/* globals require describe it beforeEach afterEach*/
"use strict";

const chai = require("chai");
const sinonModule = require("sinon");

let expect = chai.expect;

describe("Test recipe data", () => {
    const SOME_RECIPE_ID = "some_unique_recipe_ID";
    const INVALID_RECIPE_ID = "INVALID_recipe_ID";
    const SOME_RECIPE_TITLE = "some_recipe_TITLE";
    const SOME_RECIPE_IMAGE_URL = "some_recipe_URL";
    const SOME_AUTHOR = {
        _id: "user_id",
        name: "Some_Name",
        addedRecipes: []
    };

    let sinon;

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Recipe {
        constructor(properties) {
            this._id = properties.id;
            this.title = properties.title;
            this.imageUrls = properties.imageUrls;
        }

        save() {}

        static findById() {}
    }

    class Category {
        constructor(properties) {
            this._id = properties.id;
            this.recipes = properties.recipes;
        }

        static find() {}
        static select() {}
        static findByIdAndUpdate() {}
    }

    class User {
        constructor(properties) {
            this._id = properties.id;
            this.addedRecipes = properties.addedRecipes;
        }

        static findByIdAndUpdate() {}
    }

    let data = require("../../data/recipe-data")({
        Recipe,
        User,
        Category
    });

    describe("getRecipeById", () => {
        let recipe = {
            _id: SOME_RECIPE_ID,
            title: SOME_RECIPE_TITLE,
            imageUrls: SOME_RECIPE_IMAGE_URL
        };

        let recipes = [recipe];

        beforeEach(() => {
            sinon.stub(Recipe, "findById", (id, cb) => {
                let foundRecipe = recipes.find(r => r._id === id);
                if (!foundRecipe) {
                    cb(null, null);
                }

                cb(null, foundRecipe);
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
            data.getRecipeById(INVALID_RECIPE_ID)
                .then((actualRecipe => {
                    expect(actualRecipe).to.equal(null);
                    done();
                }))
                .catch(err => {
                    console.log(err);
                });
        });
    });

    describe("createRecipe", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("Expect to save the right recipe", done => {
            // arrange
            let title = SOME_RECIPE_TITLE,
                preparation = "preparation",
                cookingTimeInMinutes = 1,
                author = SOME_AUTHOR;

            sinon.stub(Recipe.prototype, "save", cb => {
                cb(null);
            });

            let categoryMethods = {
                select: {}
            };

            sinon.stub(categoryMethods, "select", () => {
                return (Promise.resolve([]));
            });
            sinon.stub(Category, "find", () => {
                return (categoryMethods);
            });

            // act
            data.createRecipe(title, [], [], [], preparation, cookingTimeInMinutes, author)
                .then(actualRecipe => {
                    // assert
                    expect(actualRecipe.title).to.eql(title);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to add recipe to its categories", done => {
            // arrange
            let title = SOME_RECIPE_TITLE,
                preparation = "preparation",
                categoriesIds = ["catId01", "catId02"],
                cookingTimeInMinutes = 1,
                author = SOME_AUTHOR;

            let category = {
                _id: categoriesIds[0],
                recipes: []
            };
            let category2 = {
                _id: categoriesIds[1],
                recipes: []
            };
            let categories = [category, category2];
            let recipe = {
                title,
                imageUrls: []
            };

            sinon.stub(Recipe.prototype, "save", cb => {
                cb(null);
            });

            let categoryMethods = {
                select: {}
            };

            sinon.stub(categoryMethods, "select", () => {
                return (Promise.resolve(categories));
            });
            sinon.stub(Category, "find", () => {
                return (categoryMethods);
            });
            sinon.stub(Category, "findByIdAndUpdate", (id) => {
                let indexFound = categories.findIndex(c => c._id === id);
                if (indexFound >= 0) {
                    categories[indexFound].recipes.push(recipe);
                }
            });

            // act
            data.createRecipe(title, categoriesIds, [], [], preparation, cookingTimeInMinutes, author)
                .then(actualRecipe => {
                    // assert
                    expect(category.recipes[0].title).to.equal(actualRecipe.title);
                    expect(category2.recipes[0].title).to.equal(actualRecipe.title);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });
});