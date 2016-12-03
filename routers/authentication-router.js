/* globals module require */
"use strict";

const express = require("express");
const passport = require("passport");

let Router = express.Router;

module.exports = function({ app, data }) {
    let controller = require("../controllers/authentication-controller")(data);

    let router = new Router();

    router
        .get("/register", controller.getSignup)
        .get("/login", controller.getLogin)
        .post("/register", controller.postSignup)
        .post("/login", controller.postLogin)
        .get("/logout", controller.logout)
        .get("/profile", controller.getAccount)
        .post("/account/profile", controller.postUpdateProfile)
        .post("/account/password", controller.postUpdatePassword)
        .post("/account/delete", controller.postDeleteAccount);


    app.use("/", router);

    // app.get("/auth/facebook",
    //     passport.authenticate("facebook"));

    // app.get("/auth/facebook/callback",
    //     passport.authenticate("facebook", { failureRedirect: "/login" }),
    //     (req, res) => {
    //         res.redirect("/");
    //     });

    app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "user_location"] }));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
        res.redirect(req.session.returnTo || "/");
    });
    return router;
};