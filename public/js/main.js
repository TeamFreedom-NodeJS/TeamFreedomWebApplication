/* globals $ prompt*/

$(() => {
    // const $ingredientsNamesList = $(".ingredients-names-list"),
    //     $ingredientsQuantityList = $(".ingredients-quantities-list"),
    //     $ingredientsUnitsList = $(".ingredients-units-list");
    // const allIngredientsNames = [],
    //     allIngredientsQuantities = [],
    //     allIngredientsUnits = [];
    // const units = ["гр.", "мл.", "ч. л.", "с. л.", "щипка", "бр."];
    // const allIngredients = [];

    // $("#btn-add-ingredient-option").on("click", ev => {
    //     ev.preventDefault();

    // $("<li/>")
    //     .append($("<input />")
    //         .attr("name", "name")
    //         .attr("type", "text")
    //         .attr("placeholder", "Име на съставка")
    //     )
    //     .append($("<input />")
    //         .attr("name", "quantity")
    //         .attr("type", "text")
    //         .attr("placeholder", "Количество")
    //     )
    //     .append($("<select />")
    //         .attr("name", "units")
    //         .append($("<option />")
    //             .attr("value", "грам")
    //             .attr("selected", "true")
    //             .text("грам"))
    //         .append($("<option />")
    //             .attr("value", "мл")
    //             .text("мл"))
    //         .append($("<option />")
    //             .attr("value", "брой")
    //             .text("брой"))
    //     )
    //     .appendTo($ingredientsList);
    // });


    const $ingredientsList = $(".ingredients-list"),
        $imageUrlsList = $(".image-list");

    $ingredientsList.on("click", ev => {
        ev.preventDefault();

        $(ev.target)
            .parent()
            .remove();
    });

    $("#btn-add-ingredient").on("click", ev => {
        ev.preventDefault();

        let ingredientPrompt = prompt("Въведете нова съставка (име-количество-мярка)");
        if (ingredientPrompt === "") {
            return false;
        }

        $("<li/>")
            .append($("<input />")
                .addClass("form-control")
                .attr("name", "ingredients")
                .attr("type", "text")
                .attr("placeholder", "Име-количество-мярка")
                .val(ingredientPrompt)
            )
            .append($("<a />")
                .addClass("btn-remove-ingredient")
                .attr("href", "#")
                .text("Премахни тази съставка")
            )
            .appendTo($ingredientsList);
    });

    $imageUrlsList.on("click", ev => {
        ev.preventDefault();

        $(ev.target)
            .parent()
            .remove();
    });

    $("#btn-add-image").on("click", ev => {
        ev.preventDefault();

        let imageUrlsPrompt = prompt("Въведете линк към снимка");
        if (imageUrlsPrompt === "") {
            return false;
        }

        $("<li/>")
            .append($("<input />")
                .addClass("form-control")
                .attr("name", "imageUrls")
                .attr("type", "text")
                .attr("placeholder", "Линк към снимка")
                .val(imageUrlsPrompt)
            )
            .append($("<a />")
                .addClass("btn-remove-image")
                .attr("href", "#")
                .text("Премахни линка към тази снимка")
            )
            .appendTo($imageUrlsList);
    });
});