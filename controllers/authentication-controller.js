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
        },
        getOauthUnlink(req, res, next) {
            const provider = req.params.provider;
            User.findById(req.user.id, (err, user) => {
                if (err) { return next(err); }
                user[provider] = undefined;
                user.tokens = user.tokens.filter(token => token.kind !== provider);
                user.save((err) => {
                    if (err) { return next(err); }
                    req.flash("info", { msg: `${provider} account has been unlinked.` });
                    res.redirect("/account");
                });
            });
        },
        getReset(req, res, next) {
            if (req.isAuthenticated()) {
                return res.redirect("/");
            }
            User
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user) => {
                    if (err) { return next(err); }
                    if (!user) {
                        req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                        return res.redirect("/forgot");
                    }
                    res.render("account/reset", {
                        title: "Password Reset"
                    });
                });
        },
        postReset(req, res, next) {
            req.assert("password", "Password must be at least 4 characters long.").len(4);
            req.assert("confirm", "Passwords must match.").equals(req.body.password);

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("back");
            }

            async.waterfall([
                function resetPassword(done) {
                    User
                        .findOne({ passwordResetToken: req.params.token })
                        .where("passwordResetExpires").gt(Date.now())
                        .exec((err, user) => {
                            if (err) { return next(err); }
                            if (!user) {
                                req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                                return res.redirect("back");
                            }
                            user.password = req.body.password;
                            user.passwordResetToken = undefined;
                            user.passwordResetExpires = undefined;
                            user.save((err) => {
                                if (err) { return next(err); }
                                req.logIn(user, (err) => {
                                    done(err, user);
                                });
                            });
                        });
                },
                function sendResetPasswordEmail(user, done) {
                    const transporter = nodemailer.createTransport({
                        service: "SendGrid",
                        auth: {
                            user: process.env.SENDGRID_USER,
                            pass: process.env.SENDGRID_PASSWORD
                        }
                    });
                    const mailOptions = {
                        to: user.email,
                        from: "ooze89@yahoo.com",
                        subject: "Your TeamFreedom CookApp password has been changed",
                        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
                    };
                    transporter.sendMail(mailOptions, (err) => {
                        req.flash("success", { msg: "Success! Your password has been changed." });
                        done(err);
                    });
                }
            ], (err) => {
                if (err) { return next(err); }
                res.redirect("/");
            });
        },
        getForgot(req, res) {
            if (req.isAuthenticated()) {
                return res.redirect("/");
            }
            res.render("authentication/forgot", {
                title: "Forgot Password"
            });
        },
        postForgot(req, res, next) {
            req.assert("email", "Please enter a valid email address.").isEmail();
            req.sanitize("email").normalizeEmail({ remove_dots: false });

            const errors = req.validationErrors();

            if (errors) {
                req.flash("errors", errors);
                return res.redirect("/forgot");
            }

            async.waterfall([
                function createRandomToken(done) {
                    crypto.randomBytes(16, (err, buf) => {
                        const token = buf.toString("hex");
                        done(err, token);
                    });
                },
                function setRandomToken(token, done) {
                    User.findOne({ email: req.body.email }, (err, user) => {
                        if (err) { return done(err); }
                        if (!user) {
                            req.flash("errors", { msg: "Account with that email address does not exist." });
                            return res.redirect("/forgot");
                        }
                        user.passwordResetToken = token;
                        user.passwordResetExpires = Date.now() + 3600000;
                        user.save((err) => {
                            done(err, token, user);
                        });
                    });
                },
                function sendForgotPasswordEmail(token, user, done) {
                    const transporter = nodemailer.createTransport({
                        service: "SendGrid",
                        auth: {
                            user: user.email,
                            pass: user.password
                        }
                    });
                    const mailOptions = {
                        to: user.email,
                        from: "ooze89@yahoo.com",
                        subject: "Reset your password on TeamFreedom CookApp",
                        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
                    };
                    transporter.sendMail(mailOptions, (err) => {
                        req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
                        done(err);
                    });
                }
            ], (err) => {
                if (err) { return next(err); }
                res.redirect("/forgot");
            });
        },
    };
};