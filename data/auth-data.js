/* globals module require Promise */

const hash = require("../models/utils/encryptor");

module.exports = function(models) {
    let {
        User
    } = models;

    return {
        findUserByCredentials(email, password) {
            return new Promise((resolve, reject) => {
                User.findOne({ email }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return hash.generatePassHash(password, user.salt)
                        .then(passHash => {
                            if (passHash !== user.passHash) {
                                return resolve(null);
                            }

                            return resolve(user);
                        })
                        .catch(error => {
                            return reject(error);
                        });
                });
            });
        },
        findUserById(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        }
    };
};