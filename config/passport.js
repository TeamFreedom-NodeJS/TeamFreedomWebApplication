/* globals module require */

const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    OAth = require("../config/facebook-oath"),
    User = require("../models/user-model");

module.exports = function({ app, data }) {
    app.use(passport.initialize());
    app.use(passport.session());

    const strategy = new LocalStrategy((username, password, done) => {
        data.findUserByCredentials(username, password)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(error => done(error, null));
    });

    passport.use(new FacebookStrategy({
            clientID: OAth.facebookOath.cliendID,
            clientSecret: OAth.facebookOath.clientSecret,
            callbackURL: OAth.facebookOath.callbackURL
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                User.findOne({ "facebook.id": profile.id }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        const newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = profile.accessToken;
                        newUser.facebook.name = profile.name.giveName + " " + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(err => {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use(strategy);

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser((id, done) => {
        // use the id serialized in the session to retrieve the use from the database
        data.findUserById(id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(error => done(error, false));
    });
};