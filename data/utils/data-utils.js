/* globals module */
module.exports = {
    loadOrCreateCategory(Category, name, imgUrl) {
        return new Promise((resolve, reject) => {
            Category.findOne({ name }, (err, dbCategory) => {
                let category = dbCategory;

                if (err) {
                    return reject(err);
                }

                if (category) {
                    return resolve(category);
                }

                category = new Category({ name, imgUrl });
                return this.save(category)
                    .then(resolve)
                    .catch(reject);
            });
        });
    },
    loadOrCreateArticle(Article, title, imgUrl, content) {
        return new Promise((resolve, reject) => {
            console.log("Mai ne vliza vytre");
            Article.findOne({ title }, (err, dbArticle) => {
                let article = dbArticle;
                console.log("loadOrCreateArticle is here: ", article);
                if (err) {
                    return reject(err);
                }

                if (article) {
                    return resolve(article);
                }

                article = new Article({ title, imgUrl, content });
                return this.save(article)
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
            console.log("--------------- ", model);
            model.save(err => {
                if (err) {
                    console.log("---------------- is in data utils -save err", err);
                    return reject(err);
                }
                console.log("---------------- is in save");
                return resolve(model);
            });
        });
    }
};