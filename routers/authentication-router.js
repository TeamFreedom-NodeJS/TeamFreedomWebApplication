/* globals module require */

const express = require("express");
const passport = require("passport");

let Router = express.Router;

module.exports = function({ app, data }) {
    let controller = require("../controllers/authentication-controller")(data);

    let router = new Router();

    router
        .get("/sign-up", controller.getSignUpForm)
        .get("/sign-in", controller.getSignInForm)
        .post("/sign-up", controller.signUp)
        .post("/sign-in", controller.signIn)
        .get("/sign-out", controller.signOut)
        .get("/profile", controller.getProfile);

    app.use("/auth", router);

    app.get("/auth/facebook",
        passport.authenticate("facebook"));

    app.get("/auth/facebook/callback",
        passport.authenticate("facebook", { failureRedirect: "/auth/sign-in" }),
        (req, res) => {
            res.redirect("/");
        });

    return router;
};