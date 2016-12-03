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







});