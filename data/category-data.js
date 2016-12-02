/* globals module require Promise */

const dataUtils = require("./utils/data-utils");

const MIN_PATTERN_LENGTH = 3;

module.exports = function(models) {
    let {
        Category
    } = models;

    return {
        createCategory(name, imgUrl) {
            return dataUtils.loadOrCreateCategory(Category, name, imgUrl);
        },
        getAllCategories() {
            return new Promise((resolve, reject) => {
                /*Category.find()
                    .then((err, categories) => {
                        console.log(categories);

                        if (err) {
                            return reject(err);
                        }

                        return resolve(categories  || []);
                    });
                    */

                Category.find((err, categories) => {
                    /* console.log(categories);
                     console.log(err);*/

                    if (err) {
                        return reject(err);
                    }

                    return resolve(categories);
                });
            });
        },
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

                    return resolve(category);
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