/* globals module */
module.exports = {
    connectionString: {
        dev: "mongodb://localhost/cookingRecipesDB"
            // prod: "mongodb://Admin:123456q@ds159747.mlab.com:59747/cooking-recipes"
    },
    port: process.env.PORT || 3001
};