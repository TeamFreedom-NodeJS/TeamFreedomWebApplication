/* globals module */
"use strict";

module.exports = {
    connectionString: {
        development: "mongodb://localhost/cookingRecipesDB",
        production: "mongodb://Azonic89:TEAMfreedom2016@ds119548.mlab.com:19548/teamfreedomwebapp"
    },
    port: process.env.PORT || 3001,
    units: ["гр.", "мл.", "ч. л.", "с. л.", "щипка", "бр."],
    errorMessage: "Възникна грешка. Молим да ни извините!"
};