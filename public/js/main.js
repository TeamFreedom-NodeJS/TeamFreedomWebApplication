/* globals $ prompt*/

$(() => {
    // const $ingredientsNamesList = $(".ingredients-names-list"),
    //     $ingredientsQuantityList = $(".ingredients-quantities-list"),
    //     $ingredientsUnitsList = $(".ingredients-units-list");
    // const allIngredientsNames = [],
    //     allIngredientsQuantities = [],
    //     allIngredientsUnits = [];

    const $ingredientsList = $(".ingredients-list"),
        allIngredients = [];
    const units = ["гр.", "мл.", "ч. л.", "с. л.", "щипка", "бр."];

    // let modalForm = $("<form>")
    //     .attr("class", "modal")
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
    //     .append($("<input />")
    //         .attr("type", "submit")
    //         .on("click", ev => {
    //             console.log("works");
    //         })
    //     );


    // $("#btn-add-ingredient-option").on("click", ev => {
    //     ev.preventDefault();

    //     modalForm.modal();
    //     let url = $("form").serialize();

    //     allIngredientsNames.push(ingredientName);
    //     $ingredientsNamesList.attr("value", allIngredientsNames.join(","));
    // });




    $("#btn-add-ingredient-option").on("click", ev => {
        ev.preventDefault();

        let ingredient = prompt("Enter ingredient: {name-quantity-units}");
        // Validate ingredients
        if (ingredient === "") {
            return false;
        }

        allIngredients.push(ingredient);
        $ingredientsList.attr("value", allIngredients.join(","));
    });

    // $("#btn-add-ingredient-option").on("click", ev => {
    //     ev.preventDefault();

    //     let ingredientName = prompt("Enter ingredient name");
    //     if (ingredientName === "") {
    //         return false;
    //     }

    //     let ingredientQuantity = prompt("Enter ingredient quantity");
    //     if (isNaN(Number(ingredientQuantity))) {
    //         return false;
    //     }

    //     let ingredientUnit = prompt("Enter ingredient units");
    //     if (units.indexOf(ingredientUnit) < 0) {
    //         return false;
    //     }

    //     allIngredientsNames.push(ingredientName);
    //     $ingredientsNamesList.attr("value", allIngredientsNames.join(","));

    //     allIngredientsQuantities.push(ingredientQuantity);
    //     $ingredientsQuantityList.attr("value", allIngredientsQuantities.join(","));

    //     allIngredientsUnits.push(ingredientUnit);
    //     $ingredientsUnitsList.attr("value", allIngredientsUnits.join(","));
    // });


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
});