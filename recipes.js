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
x.forEach(function(recipe, index) {
    recipe.selected = false;

});
// Random order of recipes
const recipeCollection = x.sort(function() {return 0.5 - Math.random()});
/* --------------------------- */

Vue.component('my-meal', {
    props: ['recipe', 'recipes', 'index'],
    methods: {
        toggleSelectedRecipe: function() {
            this.recipes[this.index].selected = !this.recipes[this.index].selected;
        }
    },
    template: '<a href="javascript:void(0);" class="list-group-item list-group-item-action" v-bind:class="{active: recipes[index].selected}" v-on:click="toggleSelectedRecipe"> {{ recipe.recipeName }}</a>',
});

var vm = new Vue({
    el: '#app',
    data: {
        recipes: recipeCollection
    },
    methods: {
        onCopy: function(e) {
            alert('Folgende Einkaufsliste ist in die Zwischenablage kopiert:\n' + e.text)
        },
        onError: function(e) {
            alert('Fehler beim Kopieren in die Zwischenablage.')
        },
        accumulateRecipes: function(a){
            console.log("var a = array;", a);
            console.log("recipes", this.recipes);
            for (var i = 0; i < a.length; ++i) {
                console.log("i", a[i].amount);
                for (var j = i + 1; j < a.length; ++j) {
                    console.log("i", a[j].amount);
                    if (a[i].name === a[j].name && a[i].unit === a[j].unit) {
                        a[i].amount += a[j].amount;
                        console.log("a.splice(j, 1);", a.splice(j, 1));
                        a.splice(j--, 1);
                    }
                }
            }
            return a;
        },
        sortIngredientsByDepartment: function(a) {
            console.log(a);
            let departments = a.map(ingredient => ingredient.department);
            console.log(departments);
        }
    },
    computed: {
        shoppingList: function() {
            let shoppingList = [];
            let recipes = this.recipes;
            // Create an array with all the ingredients of the selected recipes
            let x = recipes.filter(recipe => recipe.selected == true).map(recipe => recipe.ingredients);
            shoppingList = [].concat.apply([], x);
            // Accumulate similar ingredients
            shoppingList = this.accumulateRecipes(shoppingList);
            if (shoppingList.length > 0) {
                shoppingList = this.sortIngredientsByDepartment(shoppingList);
            }
            // Create an array with one string for each ingredient
            shoppingList = shoppingList.map(ingredient => ingredient.amount + " " + ingredient.unit + " " + ingredient.name);
            
            console.log("shoppingList", shoppingList);

            return shoppingList;
        },
        clipboardShoppingList: function() {
            return this.shoppingList.join("\n");
        },
        selectedRecipes: function() {
            return this.recipes.filter(recipe => recipe.selected == true);
        }
    }
});