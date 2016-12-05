/* globals module */
"use strict";

const User = require("../models/user-model");
const passport = require("passport");

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
            req.assert("email", "Невалиден Email адрес!!!").isEmail();
            req.assert("password", "Паролата неможе да е празна!!!").notEmpty();
            req.sanitize("email").normalizeEmail({ remove_dots: false });
            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/login");
            }

            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash("errors", info);
                    return res.redirect("/login");
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    req.flash("success", { msg: "Успешно логване в системата!!!" });
                    res.redirect(req.session.returnTo || "/profile");
                });
            })(req, res, next);
        },
        logout(req, res) {
            req.logout();
            req.flash("success", { msg: "Успешно отписване от системата!!!" });
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
            req.assert("email", "Невалиден Email адрес!!!").isEmail();
            req.assert("password", "Паролата трябва да бъде минимум 4 символа дълга!!!").len(4);
            req.assert("confirmPassword", "Паролите не съвпадат!!!").equals(req.body.password);
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
                if (err) {
                    return next(err);
                }
                if (existingUser) {
                    req.flash("errors", { msg: "Акаунт с този Email адрес вече съществува!!!." });
                    return res.redirect("/register");
                }
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        if (err) {
                            return next(err);
                        }
                        req.flash("success", { msg: "Успешна регистрация!!!" });
                        res.redirect("/");
                    });
                });
            });
        }
    };
};