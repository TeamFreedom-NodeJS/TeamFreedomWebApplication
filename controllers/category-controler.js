/* globals module */

module.exports = function(data) {
    return {
        createCategory(req, res) {
            let {
                name,
                imgUrl
            } = req.body;

            return data.createCategory(name, imgUrl)
                .then(category => {
                    return res.redirect("/categories");
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getAllCategories(req, res) {
            data.getAllCategories()
                .then(categories => {
                    return res.render("category/all", {
                        model: categories
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getCategoryByName(req, res) {
            let name = req.params.name;

            return data.getCategoryByName(name)
                .then(category => {
                    res.send(category);
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getCategoryById(req, res) {
            let id = req.params.id;

            return data.getCategoryById(id)
                .then(category => {
                    return res.render("category/details", {
                        model: category
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        getCreateCategoryForm(req, res) {
            // if (!req.isAuthenticated()) {
            //     return res.redirect("/");
            // }

            return res.render("category/create");
        },
        updateCategory(req, res) {

        },
        deleteCategory(req, res) {

        }
        // getAllReciepsByCategory()
    };
};