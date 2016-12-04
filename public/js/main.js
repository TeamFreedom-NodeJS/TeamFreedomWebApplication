/* globals $ prompt*/
"use strict";

$(() => {
    const units = ["гр.", "мл.", "ч. л.", "с. л.", "щипка", "бр."];

    const $ingredientsList = $(".ingredients-list"),
        $imageUrlsList = $(".image-list");

    function onClickRemoveParent(ev) {
        ev.preventDefault();
        let $target = $(ev.target);
        $target
            .parent()
            .remove();
    }

    $ingredientsList.on("click", ".btn-remove-ingredient", onClickRemoveParent);

    $("#btn-add-ingredient").on("click", ev => {
        ev.preventDefault();

        let $select = $("<select />")
            .attr("name", "ingredientsUnits");

        for (let unit of units) {
            $select.append($("<option />")
                .attr("value", unit)
                .text(unit));
        }

        $("<li/>")
            .append($("<input />")
                .addClass("form-control")
                .attr("name", "ingredientsName")
                .attr("type", "text")
                .attr("placeholder", "Име на съставката")
            )
            .append($("<input />")
                .attr("name", "ingredientsQuantity")
                .attr("type", "text")
                .attr("placeholder", "Количество")
            )
            .append($select)
            .append($("<a />")
                .addClass("btn-remove-ingredient")
                .attr("href", "#")
                .text("Премахни тази съставка")
            )
            .appendTo($ingredientsList);
    });

    $imageUrlsList.on("click", ".btn-remove-image", onClickRemoveParent);

    $("#btn-add-image").on("click", ev => {
        ev.preventDefault();

        $("<li/>")
            .append($("<input />")
                .addClass("form-control")
                .attr("name", "imageUrls")
                .attr("type", "text")
                .attr("placeholder", "Линк към снимка")
            )
            .append($("<a />")
                .addClass("btn-remove-image")
                .attr("href", "#")
                .text("Премахни линка към тази снимка")
            )
            .appendTo($imageUrlsList);
    });

    //--------------------- Articles -----------------------//
    $.getJSON("/articles/newest", resp => {
        let $list = $("<ul/>")
            .addClass("list-newest-articles")
            .addClass("list");

        resp.result.forEach(article => {
            $("<li/>")
                .addClass("col-lg-3 col-sm-6 col-xs-12 text-xs-center")
                .append(
                    $("<div/>")
                    .addClass("card")
                    .append(
                        $("<div/>")
                        .addClass("view overlay hm-white-slight")
                        .append(
                            $("<img/>")
                            .attr("src", article.imgUrl)
                        )
                        .append(
                            $("<a/>")
                            .attr("href", "/articles/" + article._id)
                            .append(
                                $("<div/>")
                                .addClass("mask")
                            )
                        )
                    )
                    .append(
                        $("<div/>")
                        .addClass("card-block.text-xs-center")
                        // .append(
                        //     $("<span/>")
                        //     .addClass("description-header")
                        //     .html("статия")
                        // )
                        .append(
                            $("<a/>")
                            .attr("href", "/articles/" + article._id)
                            .append(
                                $("<h3>")
                                .addClass("card-title")
                                .html(article.title)
                            )
                        )
                    )
                )
                .appendTo($list);
        });
        $list.appendTo(".newest-articles-container");
    });

    //----------------- Categories----------------------- //
    $.getJSON("/categories/newest", resp => {
        let $list = $("<ul/>")
            .addClass("list-newest-categories")
            .addClass("list");
            
        resp.result.forEach(category => {
            $("<li/>")
                .addClass("col-lg-4 col-sm-6 col-xs-12 text-xs-center")
                .append(
                    $("<div/>")
                    .addClass("card")
                    .append(
                        $("<div/>")
                        .addClass("view overlay hm-white-slight")
                        .append(
                            $("<img/>")
                            .attr("src", category.imgUrl)
                        )
                        .append(
                            $("<a/>")
                            .attr("href", "/categories/" + category._id)
                            .append(
                                $("<div/>")
                                .addClass("mask")
                            )
                        )
                    )
                    .append(
                        $("<div/>")
                        .addClass("card-block.text-xs-center")
                        .append(
                            $("<span/>")
                            .addClass("description-header")
                            .html("категория")
                        )
                        .append(
                            $("<a/>")
                            .attr("href", "/categories/" + category._id)
                            .append(
                                $("<h3>")
                                .addClass("card-title")
                                .html(category.name)
                            )
                        )
                    )
                )
                .appendTo($list);
        });
        $list.appendTo(".newest-categories-container");
    });

    //----------------- Recipes----------------------- //
    $.getJSON("/recipes/newest", resp => {
        let $list = $("<ul/>")
            .addClass("list-newest-recipes")
            .addClass("list");

        resp.result.forEach(recipe => {
            $("<li/>")
                .addClass("col-lg-4 col-sm-6 col-xs-12 text-xs-center")
                .append(
                    $("<div/>")
                    .addClass("card")
                    .append(
                        $("<div/>")
                        .addClass("view overlay hm-white-slight")
                        .append(
                            $("<img/>")
                            .attr("src", recipe.imageUrls[0])
                        )
                        .append(
                            $("<a/>")
                            .attr("href", "/recipes/" + recipe._id)
                            .append(
                                $("<div/>")
                                .addClass("mask")
                            )
                        )
                    )
                    .append(
                        $("<div/>")
                        .addClass("card-block.text-xs-center")
                        .append(
                            $("<a/>")
                            .attr("href", "/recipes/" + recipe._id)
                            .append(
                                $("<h3>")
                                .addClass("card-title")
                                .html(recipe.title)
                            )
                        )
                        // .append(
                        //     $("<span/>")
                        //     .addClass("description-header")
                        //     .html("автор")
                        // )
                    )
                )
                .appendTo($list);
        });
        $list.appendTo(".newest-recipes-container");
    });

});