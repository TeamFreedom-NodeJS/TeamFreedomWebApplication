/* globals require describe it beforeEach afterEach*/

const chai = require("chai");
const sinonModule = require("sinon");

let expect = chai.expect;

describe("Test categories data", () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Category {
        constructor(propeties) {
            this.name = propeties.name;
            this.imgUrl = propeties.imgUrl;
        }

        save() {

        }

        static find() {}
        static findOne() {}
    }

    let data = require("../../data/category-data")({
        Category
    });

    describe("getAllCategories", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return empty array if there is not categories", done => {
            let categories = [];
            sinon.stub(Category, "find", (_, cb) => {
                cb(null, categories);
            });

            // act
            data.getAllCategories()
                .then(actualcategories => {
                    // assert
                    expect(actualcategories).to.eql([]);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return 1 category", done => {
            let categories = ["Предястия"];
            sinon.stub(Category, "find", (_, cb) => {
                cb(null, categories);
            });

            // act
            data.getAllCategories()
                .then(actualcategories => {
                    // assert
                    expect(actualcategories).to.eql(categories);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return 2 categories", done => {
            // arrange
            let categories = ["Предястие", "Основно ястие"];
            sinon.stub(Category, "find", (_, cb) => {
                cb(null, categories);
            });

            // act
            data.getAllCategories()
                .then(actualcategories => {
                    // assert
                    expect(actualcategories).to.eql(categories);
                    done();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });

    describe("getCategoryById", () => {
        let existingCategoryId = 1;

        let category = {
            _id: existingCategoryId,
            name: "Предястие"
        };

        let categories = [category];

        beforeEach(() => {
            sinon.stub(Category, "findOne", (query, cb) => {
                let id = query._id;
                let foundCategory = categories.find(fr => fr._id === id);
                cb(null, foundCategory);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the category", done => {
            data.getCategoryById(existingCategoryId)
                .then((actualCategory => {
                    expect(actualCategory).to.equal(category);
                    done();
                }))
                .catch(err => {
                    console.log(err);
                });
        });

        it("Expect to return null, when no category with the id", done => {
            data.getCategoryById(2)
                .then((actualCategory => {
                    expect(actualCategory).to.equal(null);
                    done();
                }));
        });

        // it("Expect to throw if input is json or other", done => {
        //     expect(1).to.eql(2);
        // });
    });

    describe("createCategory", () => {
        beforeEach(() => {
            sinon.stub(Category.prototype, "save", cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to save the Category, when valid parameters", done => {
            let name = "Зaглавие";
            let imgUrl = "URL-1";

            data.createCategory(name, imgUrl)
                .then(actualCategory => {
                    expect(actualCategory.name).to.equal(name);
                    expect(actualCategory.imgUrl).to.equal(imgUrl);
                    done();
                });
        });

        // ----------- name ----------------
        it("Expect to fail, when name is empty", done => {
            let name = "";
            let imgUrl = "URL";

            data.createCategory(name, imgUrl)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when name length is 2 characters long", done => {
            let name = "AA";
            let imgUrl = "URL";

            data.createCategory(name, imgUrl)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when name length is 51 characters long", done => {
            let name = "A".repeat(51);
            let imgUrl = "URL";

            data.createCategory(name, imgUrl)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        // ------------------ imgUrl ------------------------

        it("Expect to fail, when imgUrl is empty", done => {
            let name = "Зaглавие";
            let imgUrl = "";

            data.createCategory(name, imgUrl)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        it("Expect to fail, when imgUrl is 2 characters long", done => {
            let name = "Зaглавие";
            let imgUrl = "AA";

            data.createCategory(name, imgUrl)
                .catch(err => {
                    expect(err);
                    done();
                });
        });

        // describe("editCategoryById", () => {
        //     let existingCategoryId = 1;
        //     let existingCategoryTitle = "Предястие-1";
        //     let existingCategoryImgUrl = "ImgUrl-1";
        //     let existingCategoryContent = "Content-1";

        //     let category = {
        //         _id: existingCategoryId,
        //         name: existingCategoryTitle,
        //         imgUrl: existingCategoryImgUrl,
        //         content: existingCategoryContent
        //     };

        //     let categories = [category];

        //     beforeEach(() => {
        //         sinon.stub(Category, "findOne", (query, cb) => {
        //             let id = query._id;
        //             let foundCategory = categories.find(fr => fr._id === id);
        //             cb(null, foundCategory);
        //         });
        //     });

        //     afterEach(() => {
        //         sinon.restore();
        //     });

        //     it("Expect to edit this category, when valid parameters", done => {
        //         let newCategoryId = 1;
        //         let newCategoryTitle = "Предястие-1";
        //         let newCategoryImgUrl = "ImgUrl-1";
        //         let newCategoryContent = "Content-1";

        //         data.editCategoryById(
        //             newCategoryId,
        //             newCategoryTitle,
        //             newCategoryImgUrl,
        //             newCategoryContent)
        //         .then(editedCategory => {
        //             expect(editedCategory._id).to.equal(category._id);
        //             expect(editedCategory.name).to.equal(newCategoryTitle);
        //             expect(editedCategory.imgUrl).to.equal(newCategoryImgUrl);
        //             expect(editedCategory.content).to.equal(newCategoryContent);
        //             done();
        //         });
        //     });
        // });
    });
});