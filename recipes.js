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
console.log("this.rezepteSammlung after adding props", this.rezepteSammlung);
const recipeCollection = x;
console.log("rezepteSammlung:", recipeCollection);
/* --------------------------- */

Vue.component('my-meal', {
    props: ['recipe', 'recipes', 'index'],
    methods: {
        toggleSelectedRecipe: function() {
            this.recipes[this.index].selected = !this.recipes[this.index].selected;
        }
    },
    template: '<a href="#" class="list-group-item list-group-item-action" v-bind:class="{active: recipes[index].selected}" v-on:click="toggleSelectedRecipe"> {{ recipe.recipeName }}</a>',
})

var vm = new Vue({
    el: '#app',
    data: {
        recipes: recipeCollection
    },
    methods: {},
    computed: {
        shoppingList: function() {
            // Get ingredients of all selected recipes
            let x = this.recipes.filter(recipe => recipe.selected == true).map(recipe => recipe.ingredients);
            console.log("x: ", x);
            let shoppingList = [].concat.apply([], x);
            console.log("shoppingList", shoppingList);
            shoppingList = shoppingList.map(ingredient => ingredient.amount + " " + ingredient.unit + " " + ingredient.name);
            console.log("shoppingList: ", shoppingList);
            document.execCommand("copy", "a");
            return shoppingList;

        },
        selectedRecipes: function() {
            return this.recipes.filter(recipe => recipe.selected == true);
        }
    }
});

// einkaufsListeHatBereitsZutat: function(zutat) {
//         for (var i = 0; i < einkaufsListe.length; i++) {
//             if (einkaufsListe[i][2] == zutat) {
//                 return true;
//             }
//         }
//     }