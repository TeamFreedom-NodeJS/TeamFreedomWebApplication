/* globals module require Promise */

const dataUtils = require("./utils/data-utils");

const MIN_PATTERN_LENGTH = 3;

module.exports = function (models) {
    let {
        Category
    } = models;

    return {
        createCategory(name, imgUrl) {
            let category = new Category({ name, imgUrl });
            if (3 > name.length || name.length > 20) {
                console.log("--------------ïnvalid title length.", name.length);
                return Promise.reject({ reason: "Name must be between 3 and 20 characters long." });
            }

            if (3 > imgUrl.length) {
                console.log("--------------ïnvalid imgUrl length.", imgUrl.length);
                return Promise.reject({ reason: "Image url must be bigger than 3 charecters long." });
            }

            return new Promise((resolve, reject) => {
                category.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category);
                });
            });
        },
        getAllCategories() {
            return new Promise((resolve, reject) => {
                Category.find({}, (err, categories) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(categories);
                });
            });
        },

        // getAllCategories() {
        //     return new Promise((resolve, reject) => {
        //         Category.find()
        //             .then((err, categories) => {

        //                 if (err) {
        //                     return reject(err);
        //                 }

        //                 return resolve(categories);
        //             });


        //         Category.find((err, categories) => {
        //             if (err) {
        //                 return reject(err);
        //             }

        //             return resolve(categories);
        //         });
        //     });
        // },
        getCategoryByName(name) {
            return new Promise((resolve, reject) => {
                Category.findOne({
                    name
                }, (err, category) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category);
                });
            });
        },
        getCategoryById(id) {
            return new Promise((resolve, reject) => {
                Category.findOne({
                    _id: id
                }, (err, category) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category || null);
                });
            });
        },
        getNewestCategories(count) {
            console.log("-----------getNewestCategories", count);
            return new Promise((resolve, reject) => {
                Category.find({})
                    .sort({ createdAt: -1 })
                    .limit(count)
                    .exec((err, categories) => {
                        if (err) {
                            console.log("getNewestCategories errrrrrr");

                            return reject(err);
                        }

                        console.log("getNewestCategories: ", categories);
                        return resolve(categories);
                    });
            });
        },
        // updateCategory(categoryName, newName, imgUrl) {
        //     return new Promise((resolve, reject) => {
        //         Category.findOne({
        //         name: categoryName
        //     }, function(err, doc) {
        //         if (err) {
        //             reject(err)
        //         }

        //         doc.name = newName;
        //         doc.visits.$inc();
        //         doc.save();

        //         return resolve(doc);
        //     })
        //     });
        // }
        // },
        // deleteCategory(name) {

        // },
        searchCategories({
            pattern,
            page,
            pageSize
        }) {
            let query = {};
            if (typeof pattern === "string" && pattern.length >= MIN_PATTERN_LENGTH) {
                query.$or = [{
                    name: new RegExp(`.*${pattern}.*`, "gi")
                }];
            }

            let skip = (page - 1) * pageSize,
                limit = page * pageSize;

            return new Promise((resolve, reject) => {
                Category.find()
                    .where(query)
                    .skip(skip)
                    .limit(limit)
                    .exec((err, categories) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(categories || []);
                    });
            });
        }
    };
};