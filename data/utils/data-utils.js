/* globals module */
module.exports = {
    loadOrCreateCategory(Category, name) {
        return new Promise((resolve, reject) => {
            Category.findOne({ name }, (err, dbCategory) => {
                let category = dbCategory;

                if (err) {
                    return reject(err);
                }

                if (category) {
                    return resolve(category);
                }

                category = new Category({ name });
                return this.save(category)
                    .then(resolve)
                    .catch(reject);
            });
        });
    },
    update(model) {
        return new Promise((resolve, reject) => {
            model.save(err => {
                if (err) {
                    return reject(err);
                }
                return resolve(model);
            });
        });
    },
    save(model) {
        return new Promise((resolve, reject) => {
            model.save(err => {
                if (err) {
                    return reject(err);
                }

                return resolve(model);
            });
        });
    }
};