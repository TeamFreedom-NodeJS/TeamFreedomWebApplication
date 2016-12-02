/* globals module require */
"use strict";

const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    OAth = require("../config/facebook-oath"),
    User = require("../models/user-model");

module.exports = function({ app, data }) {
    app.use(passport.initialize());
    app.use(passport.session());

    // passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //     User.findOne({ email: email.toLowerCase() }, (err, user) => {
    //             if (err) {
    //                 return done(err);
    //             }
    //             if (!user) {
    //                 return done(null, false, { msg: `Email ${email} not found.` });
    //             }

    //             return user;
    //         })
    //         .then(user => {
    //             if (user) { // && user.uthenticatePassword(password)
    //                 done(null, user);
    //             } else {
    //                 done(null, false);
    //             }
    //         })
    //         .catch(error => done(error, false));
    // }));
    passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { msg: "Invalid email or password." });
            });
        });
    }));

    passport.use(new FacebookStrategy({
        clientID: OAth.facebookOath.clientID,
        clientSecret: OAth.facebookOath.clientSecret,
        callbackURL: OAth.facebookOath.callbackURL,
        profileFields: ["name", "email", "link", "locale", "timezone"],
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        if (req.user) {
            User.findOne({ facebook: profile.id }, (err, existingUser) => {
                if (err) {
                    return done(err);
                }
                if (existingUser) {
                    req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
                    done(err);
                }
                User.findById(req.user.id, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    user.facebook = profile.id;
                    user.tokens.push({ kind: "facebook", accessToken });
                    user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = user.profile.gender || profile.json.gender;
                    user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.save((err) => {
                        req.flash("info", { msg: "Facebook account has been linked." });
                        done(err, user);
                    });
                });

            });
        } else {
            User.findOne({ facebook: profile.id }, (err, existingUser) => {
                if (err) {
                    return done(err);
                }
                if (existingUser) {
                    return done(null, existingUser);
                }
                User.findOne({ email: profile.json.email }, (err, existingEmailUser) => {
                    if (err) {
                        return done(err);
                    }
                    if (existingEmailUser) {
                        req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
                        done(err);
                    } else {
                        const user = new User();
                        user.email = profile.json.email;
                        user.facebook = profile.id;
                        user.tokens.push({ kind: "facebook", accessToken });
                        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                        user.profile.gender = profile.json.gender;
                        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                        user.profile.location = (profile.json.location) ? profile.json.location.name : "";
                        user.save((err) => {
                            done(err, user);
                        });
                    }
                });
            });
        }
    }));

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.id);
        }
    });

    passport.deserializeUser((id, done) => {
        data.findUserById(id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(error => done(error, false));
    });

    passport.isAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    };

    // function isAuthorized(req, res, next) {
    //     const provider = req.path.split("/").slice(-1)[0];

    //     if (_.find(req.user.tokens, { kind: provider })) {
    //         next();
    //     } else {
    //         res.redirect(`/auth/${provider}`);
    //     }
    // }
};

/**
 * Login Required middleware.
 */
// module.exports.isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// };

/**
 * Authorization Required middleware.
 */
// module.exports.isAuthorized = (req, res, next) => {
//     const provider = req.path.split("/").slice(-1)[0];

//     if (_.find(req.user.tokens, { kind: provider })) {
//         next();
//     } else {
//         res.redirect(`/auth/${provider}`);
//     }
// };