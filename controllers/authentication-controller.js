/* globals module */
const passport = require("passport");

module.exports = function(data) {
    return {
        signUp(req, res) {
            let { username, password } = req.body;
            data.createUser(username, password)
                .then(user => {
                    return res.redirect("/auth/sign-in");
                });
        },
        signIn(req, res, next) {
            const auth = passport.authenticate("local", function(error, user) {
                if (error) {
                    next(error);
                    return;
                }

                if (!user) {
                    res.status(400);
                    res.json({
                        success: false,
                        message: "Invalid name or password!"
                    });
                }

                req.login(user, error => {
                    if (error) {
                        next(error);
                        return;
                    }

                    res.status(200)
                        .send({ redirectRoute: "/auth/profile" });
                });
            });

            return Promise.resolve()
                .then(() => {
                    auth(req, res, next);
                });
        },
        signOut(req, res) {
            return Promise.resolve()
                .then(() => {
                    req.logout();
                    res.redirect("/");
                });
        },
        getSignUpForm(req, res) {
            return res.render("authentication/sign-up");
        },
        getSignInForm(req, res) {
            return res.render("authentication/sign-in");
        },
        getProfile(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.status(401).redirect("/unauthorized");
                    } else {
                        res.render("authentication/profile", { user: req.user });
                    }
                });
            // return res.render("authentication/profile");
        }
    };
};