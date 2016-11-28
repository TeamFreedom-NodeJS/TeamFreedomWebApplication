/* globals console module require Promise */
const hash = require("../models/utils/encryptor");

module.exports = function(models) {
    let {
        User
    } = models;

    return {
        createUser(username, password) {
            let salt;

            return hash.generateSalt()
                .then(sl => {
                    salt = sl;
                    return hash.generatePassHash(password, sl);
                })
                .then(passHash => {
                    let user = new User({ username, salt, passHash });
                    return user;
                })
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