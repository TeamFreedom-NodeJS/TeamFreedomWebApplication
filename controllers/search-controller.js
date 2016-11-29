/* globals module */

const DEFAULT_PAGE = 1,
    PAGE_SIZE = 10;

module.exports = function(data) {
    return {
        search(req, res) {
            let pattern = req.query.pattern || "";
            let page = Number(req.query.page || DEFAULT_PAGE);

            return Promise.all([data.searchRecipes(({ pattern, page, pageSize: PAGE_SIZE })), data.searchCategories({ pattern, page, pageSize: PAGE_SIZE })])
                .then(([recipes, categories]) => {
                    return res.render("search/search", {
                        model: {
                            recipes,
                            categories
                        },
                        params: { pattern },
                        user: req.user
                    });
                });

        }
    };
};