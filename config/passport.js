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

    passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
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

        User.findOne({ facebook: profile.id }, (err, existingUser) => {

            process.nextTick(function() {
                User.findOne({ "facebook.id": profile.id }, function(err, user) {

                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.email = profile.emails[0].value;
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.facebook.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                });
            });
        });
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
};