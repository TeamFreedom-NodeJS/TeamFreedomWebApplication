"use strict";

const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const EMAIL_REGEX_PATTERN =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        match: EMAIL_REGEX_PATTERN
    },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        picture: String
    },
    tokens: Array,

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    },
    favouriteRecipes: [{}],
    addedRecipes: [{}],
    role: {
        type: String,
        enum: ["user", "admin"]
    }
}, { timestamps: true });

userSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;