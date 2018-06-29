/* Read JSON-File from Server */
let x;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        x = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "https://rawgit.com/crelder/recipe-shoppinglist-generator/develop/recipes.json", false);
xmlhttp.send();
// Use the hereby added recipe.selected Property to select/unselect recipes in the GUI and to define the shopping list.
x.forEach(function(recipe) {
    recipe.selected = false;
    });
console.log("this.rezepteSammlung after adding props",this.rezepteSammlung);
const recipeCollection = x;
console.log("rezepteSammlung:", recipeCollection);
/* --------------------------- */

Vue.component('my-meal', {
    props: ['recipe', 'recipes', 'index'],
    methods: {
        toggleSelectedRecipe: function() {
            this.recipes[this.index].selected = !this.recipes[this.index].selected;
            // console.log(this.recipes[this.index].rezeptName);
            // console.log("this.recipes[this.index].selected:", this.recipes[this.index].selected);
            // console.log("ingredients: ", this.ingredients);
        }
    },
    template: '<a href="#" class="list-group-item list-group-item-action" v-bind:class="{active: recipes[index].selected}" v-on:click="toggleSelectedRecipe"> {{ recipe.recipeName }}</a>',
})

var vm = new Vue({
    el: '#app',
    data: {
        recipes: recipeCollection
    },
    methods: {
        // Löschen
        log: function() {
            console.log(this.shoppingList, this.recipes)
        },
        einkaufsListeHatBereitsZutat: function(zutat) {
                for (var i = 0; i < einkaufsListe.length; i++) {
                    if (einkaufsListe[i][2] == zutat) {
                        return true;
                    }
                }
            }
    },
    computed: {
        shoppingList: function() {
            console.log("filter und map: ", this.recipes.filter(recipe => recipe.selected == true).map(recipe => recipe.ingredients));
            // Get ingredients of all selected recipes
            let x = this.recipes.filter(recipe => recipe.selected == true).map(recipe => recipe.ingredients);
            let shoppingList = x.map(ingredient => ingredient.amount + ingredient.unit + ingredient.name);

            // function shoppingListHasIngredient(ingredient) {
            //     if (shoppingList[i][2] == ingredient) {
            //         return true;
            // }

            // x.forEach(function(ingredient) {
            //     if (!shoppingListHasIngredient(ingredient)) {
            //         shoppingList.push(ingredient);
            //     } else {
            //         console.log("indexOf(ingredient: ", indexOf(ingredient));
            //         shoppingList[indexOf(ingredient)][0] += ingredient.amount;
            //     }
            //     console.log("shoppingList: ", shoppingList);
            // });                
            // return shoppingList;
            return x;

            // shoppingList.concat(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
                //         console.log(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
                //         // console.log(einkaufsListe[i][2] + ": " + einkaufsListe[i][0] + einkaufsListe[i][1]);
            
        // function printEinkaufsListe() {
//     for (var i = 0; i < einkaufsListe.length; i++) {
//         shoppingList.concat(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
//         console.log(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
//         // console.log(einkaufsListe[i][2] + ": " + einkaufsListe[i][0] + einkaufsListe[i][1]);
//     }
// }


// var einkaufsListe = [];

// function generate(menge, einheit, zutat) {
//     if (einkaufsListeHatBereitsZutat(zutat)) {
//         einkaufsListe[zutatPositionInEinkaufsListe(zutat)][0] += menge;
//     } else {
//         einkaufsListe[einkaufsListe.length] = [menge, einheit, zutat];
//     }
// }
        
        
        }
    }

    // mit br und 1 Sekunde verzögerung. Und transition effekts.
    /* -- Vue Instance ends */
});


// /* Declare Variables */
// var shoppingList = 'Hallo';
// var recipes = '';
// /* ------------------*/

// /* Test String für die Zutaten-Ausgabe */
// var zutaten1 = ["Packung Parmesan",
//     "1Packung Rucula Salat",
//     "1 Tomaten",
//     "1Packung Weichweizengrieß",
//     "2740ml Milch",
//     "250g Reibekäse",
//     "350ml Süße Sahne",
//     "250g Schinken",
//     "0.25Tube Tomatenmark",
//     "3 Seelen",
//     "1Packung Köln Haferflocken (blau)",
//     "1Packung Ovomaltine",
//     "5 Bananen",
//     "4 Äpfel",
//     "1 Sonstige Saisonfrüchte für Müsli",
//     "150g Speckwürfel",
//     "11 Eier",
//     "200g Spaghetti",
//     "625g Margarine",
//     "4 Zitrone",
//     "375g Zucker",
//     "840g Mehl",
//     "100g Speisestärke",
//     "2.5Packung Backpulver",
//     "250g Puderzucker",
//     "60g Kakaopulver"
// ];
// /**** */

// function showAllRezeptNamenEinkaufsListe() {
//     var rezepteString = '';
//     for (var i = 0; i < einkaufsListeRezepte.length - 1; i++) {
//         rezepteString += einkaufsListeRezepte[i].toUpperCase() + ', ';
//     }
//     rezepteString += einkaufsListeRezepte[einkaufsListeRezepte.length - 1].toUpperCase()
//     console.log(rezepteString.toUpperCase());
// }


// function showAllRezepte() {
//     for (var i = 0; i < rezepteSammlung.length; i++) {
//         console.log(rezepteSammlung[i].rezeptName.toUpperCase());
//         for (var j = 0; j < rezepteSammlung[i].zutaten.length; j++) {
//             console.log(rezepteSammlung[i].zutaten[j].menge + rezepteSammlung[i].zutaten[j].einheit + ' ' + rezepteSammlung[i].zutaten[j].zutat);
//         }
//         console.log("\"" + rezepteSammlung[i].kommentar + "\"");
//         console.log(" ");
//     }
// }


// function zutatPositionInEinkaufsListe(zutat) {
//     for (var i = 0; i < einkaufsListe.length; i++) {
//         if (einkaufsListe[i][2] == zutat) {
//             return i;
//             break;
//         }
//     }
// }


// function einkaufsListeHatBereitsZutat(zutat) {
//     for (var i = 0; i < einkaufsListe.length; i++) {
//         if (einkaufsListe[i][2] == zutat) {
//             return true;
//         }
//     }
// }


// function printSpacePadded(menge, einheit, zutat) {
//     var textString = menge + einheit;
//     while (textString.length < 10) {
//         textString = " " + textString;
//     }
//     textString += ' ' + zutat;
//     return textString;
// }


// function printEinkaufsListe() {
//     for (var i = 0; i < einkaufsListe.length; i++) {
//         shoppingList.concat(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
//         console.log(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
//         // console.log(einkaufsListe[i][2] + ": " + einkaufsListe[i][0] + einkaufsListe[i][1]);
//     }
// }


// var einkaufsListe = [];

// function generate(menge, einheit, zutat) {
//     if (einkaufsListeHatBereitsZutat(zutat)) {
//         einkaufsListe[zutatPositionInEinkaufsListe(zutat)][0] += menge;
//     } else {
//         einkaufsListe[einkaufsListe.length] = [menge, einheit, zutat];
//     }
// }


// var einkaufsListeRezepte = [];

// function generateRezeptName(rezeptName) {
//     einkaufsListeRezepte[einkaufsListeRezepte.length] = rezeptName;
// }


// function askRezepteFuerDieWoche() {
//     //   for (var i = 0; i < rezepteSammlung.length; i++) { <!-- For development mode: change back to production mode -->
//     for (var i = 0; i < 2; i++) {
//         if (confirm('Willst Du "' + rezepteSammlung[i].rezeptName + '"?') == true) {
//             for (var j = 0; j < rezepteSammlung[i].zutaten.length; j++) {
//                 generate(rezepteSammlung[i].zutaten[j].menge, rezepteSammlung[i].zutaten[j].einheit, rezepteSammlung[i].zutaten[j].zutat);
//             }
//             generateRezeptName(rezepteSammlung[i].rezeptName);
//         }
//     }
// }

// /* var grundzutaten =['Salz','Zucker','Zimt','Olivenöl','Balsamico-Essig','Weißweinessig','Pfeffer','Senf'];
// function printGrundZutaten(){
// for (var i = 0; i < grundzutaten.length; i++) {
//   console.log((i +1) + '. ' grundzutaten[i]);
// };
// }*/


// // //////////////////////////////////////////
// // Ausgabe///////////////////////////////////
// // /////////////////////////////////////////
// // askRezepteFuerDieWoche();
// // // console.log("--------------EINKAUFSLISTE--------------");
// // printEinkaufsListe();

// // console.log(" ");

// // // printGrundZutaten();

// // console.log(" ");

// // console.log("Damit kann man folgende Rezepte kochen:");
// // showAllRezeptNamenEinkaufsListe();

// // console.log(" ");
// // console.log(" ");

// // console.log("--------------REZEPTE--------------------")
// // showAllRezepte();