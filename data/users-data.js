/* globals console module require Promise */
"use strict";

module.exports = function(models) {
    let {
        User
    } = models;

    return {
        createUser() {
            return new User()
                .then(user => {
                    user.save(err => {
                        if (err) {
                            return err;
                        }
                        return user;
                    });
                })
                .catch(err => {
                    return err;
                });
        }
    };
};