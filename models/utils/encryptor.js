"use strict";

const LEN = 512,
    SALT_LEN = 128,
    ITERATIONS = 10000,
    DIGEST = "sha256",
    BASE = "base64";

const crypto = require("crypto");

module.exports = {
    generateSalt() {
        let salt = crypto.randomBytes(SALT_LEN).toString(BASE);
        return Promise.resolve(salt);
    },
    generatePassHash(password, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, ITERATIONS, LEN, DIGEST, (err, derivedKey) => {
                if (err) {
                    return reject(err);
                }

                return resolve(derivedKey.toString(BASE));
            });
        });
    }
};