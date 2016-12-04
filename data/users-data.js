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
        },
        getUserById(id) {
            return new Promise((resolve, reject) => {
                User.findOne({
                    _id: id
                }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user || null);
                });
            });
        },

        addToFavorites(userId, recipe) {
            return new Promise((resolve, reject) => {
                let recipeInfo = {
                    id: recipe._id,
                    title: recipe.title,
                    imageUrl: recipe.imageUrls[0]
                };
                User.findByIdAndUpdate(
                    userId, { $push: { favouriteRecipes: recipeInfo } }, { safe: true },
                    err => {
                        if (err) {
                            return reject(err);
                        }
                    });

                return resolve(recipe);
            });
        }
    };
};