/* globals module */
"use strict";

const User = require("../models/user-model");
const passport = require("passport");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = function() {
    return {
        getLogin(req, res) {
            if (req.user) {
                return res.redirect("/");
            }
            res.render("authentication/sign-in", {
                title: "Login"
            });
        },
        postLogin(req, res, next) {
            req.assert("email", "Email is not valid").isEmail();
            req.assert("password", "Password cannot be blank").notEmpty();
            req.sanitize("email").normalizeEmail({ remove_dots: false });
            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/login");
            }

            passport.authenticate("local", (err, user, info) => {
                if (err) { return next(err); }
                if (!user) {
                    req.flash("errors", info);
                    return res.redirect("/login");
                }
                req.logIn(user, (err) => {
                    if (err) { return next(err); }
                    req.flash("success", { msg: "Success! You are logged in." });
                    res.redirect(req.session.returnTo || "/profile");
                });
            })(req, res, next);
        },
        logout(req, res) {
            req.logout();
            res.redirect("/");
        },
        getSignup(req, res) {
            if (req.user) {
                return res.redirect("/");
            }
            res.render("authentication/sign-up", {
                title: "Create Account"
            });
        },
        postSignup(req, res, next) {
            req.assert("email", "Email is not valid").isEmail();
            req.assert("password", "Password must be at least 4 characters long").len(4);
            req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
            req.sanitize("email").normalizeEmail({ remove_dots: false });

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/register");
            }

            const user = new User({
                email: req.body.email,
                password: req.body.password
            });

            User.findOne({ email: req.body.email }, (err, existingUser) => {
                if (err) { return next(err); }
                if (existingUser) {
                    req.flash("errors", { msg: "Account with that email address already exists." });
                    return res.redirect("/profile");
                }
                user.save((err) => {
                    if (err) { return next(err); }
                    req.logIn(user, (err) => {
                        if (err) {
                            return next(err);
                        }
                        res.redirect("/profile");
                    });
                });
            });
        },
        getAccount(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.status(401).redirect("/unauthorized");
                    } else {
                        res.render("authentication/profile", { user: req.user });
                    }
                });
        },
        postUpdateProfile(req, res, next) {
            req.assert("email", "Please enter a valid email address.").isEmail();
            req.sanitize("email").normalizeEmail({ remove_dots: false });

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/profile");
            }

            User.findById(req.user.id, (err, user) => {
                if (err) { return next(err); }
                user.email = req.body.email || "";
                user.profile.name = req.body.name || "";
                user.profile.gender = req.body.gender || "";
                user.profile.location = req.body.location || "";
                user.profile.website = req.body.website || "";
                user.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
                            return res.redirect("/profile");
                        }
                        return next(err);
                    }
                    req.flash("success", { msg: "Profile information has been updated." });
                    res.redirect("/profile");
                });
            });
        },
        postUpdatePassword(req, res, next) {
            req.assert("password", "Password must be at least 4 characters long").len(4);
            req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/profile");
            }

            User.findById(req.user.id, (err, user) => {
                if (err) { return next(err); }
                user.password = req.body.password;
                user.save((err) => {
                    if (err) { return next(err); }
                    req.flash("success", { msg: "Password has been changed." });
                    res.redirect("/profile");
                });
            });
        },
        postDeleteAccount(req, res, next) {
            User.remove({ _id: req.user.id }, (err) => {
                if (err) { return next(err); }
                req.logout();
                req.flash("info", { msg: "Your account has been deleted." });
                res.redirect("/");
            });
        }
    };
};