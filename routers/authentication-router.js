/* globals module require */
"use strict";

const express = require("express");
const passport = require("passport");

let Router = express.Router;

module.exports = function({ app, data }) {
    let authController = require("../controllers/authentication-controller")(data),
        userController = require("../controllers/user-controller")(data);


    let router = new Router();

    router
        .get("/register", authController.getSignup)
        .get("/login", authController.getLogin)
        .post("/register", authController.postSignup)
        .post("/login", authController.postLogin)
        .get("/logout", authController.logout)
        .get("/profile", userController.getAccount)
        .post("/account/profile", userController.postUpdateProfile)
        .post("/account/password", userController.postUpdatePassword)
        .post("/account/delete", userController.postDeleteAccount);


    app.use("/", router);

    app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "user_location"] }));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
        res.redirect(req.session.returnTo || "/");
    });

    return router;
};