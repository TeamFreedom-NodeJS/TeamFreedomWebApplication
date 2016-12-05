"use strict";

const User = require("../models/user-model");

module.exports = function(data) {
    return {
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
            req.assert("email", "Моля въведете валиден Email адрес!!!").isEmail();
            req.sanitize("email").normalizeEmail({ remove_dots: false });

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/profile");
            }
            User.findById(req.user.id, (err, user) => {
                if (err) {
                    return next(err);
                }
                user.email = req.body.email || "";
                user.profile.name = req.body.name || "";
                user.profile.gender = req.body.gender || "";
                user.profile.location = req.body.location || "";
                user.profile.website = req.body.website || "";
                user.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            req.flash("errors", { msg: "Email адресът който въведохте вече е асоциазиран със съществуващ акаунт!!!" });
                            return res.redirect("/profile");
                        }
                        return next(err);
                    }
                    req.flash("success", { msg: "Информацията във вашият профил е сменена!!!" });
                    res.redirect("/profile");
                });
            });
        },
        postUpdatePassword(req, res, next) {
            req.assert("password", "Паролата трябва да е поне 4 символа!!!").len(4);
            req.assert("confirmPassword", "Паролите не се съвпадат!!!").equals(req.body.password);

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/profile");
            }

            User.findById(req.user.id, (err, user) => {
                if (err) {
                    return next(err);
                }
                user.password = req.body.password;
                user.save((err) => {
                    if (err) { return next(err); }
                    req.flash("success", { msg: "Паролата ви е сменена!!!" });
                    res.redirect("/profile");
                });
            });
        },
        postDeleteAccount(req, res, next) {
            User.remove({ _id: req.user.id }, (err) => {
                if (err) {
                    return next(err);
                }
                req.logout();
                req.flash("info", { msg: "Вашият акаунт е вече изтрит!!!" });
                res.redirect("/");
            });
        },
        allAddedRecipes(req, res) {
            let id = req.params.id;
            return data.getUserById(id)
                .then(currentUser => {
                    return res.render("user/my-recipes", {
                        model: currentUser,
                        user: req.user
                    });
                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        allFavoritesRecipes(req, res) {
            let id = req.params.id;
            return data.getUserById(id)
                .then(currentUser => {
                    return res.render("user/my-favorites", {
                        model: currentUser,
                        user: req.user
                    });

                })
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        },
        addToFavorites(req, res) {
            let userId = req.user._id;
            let recipe = JSON.parse(req.body.recipe);
            return data.addToFavorites(userId, recipe)
                .then(res.status(203))
                .catch(err => {
                    res.status(400)
                        .send(err);
                });
        }
    };
};