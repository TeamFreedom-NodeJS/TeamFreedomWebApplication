/* globals module require Promise */

const dataUtils = require("./utils/data-utils"),
    mapper = require("../utils/mapper");

const MIN_PATTERN_LENGTH = 3;

module.exports = function(models) {
    let {
        Category
    } = models;

    return {
        getCategories() {
            return new Promise((resolve, reject) => {
                Category.find((err, categories) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(categories);
                });
            });
        },
        searchCategories({ pattern, page, pageSize }) {
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
        },
        getCategoryById(id) {
            return new Promise((resolve, reject) => {
                Category.findOne({ _id: id }, (err, category) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category);
                });
            });
        }
    };
};