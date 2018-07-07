/* Read JSON-File from Server */
let x;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        x = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "https://cdn.rawgit.com/crelder/recipe-shoppinglist-generator/master/recipes.json", false);
xmlhttp.send();
// Use the hereby added recipe.selected Property to select/unselect recipes in the GUI and to define the shopping list.
x.forEach(function(recipe, index) {
    recipe.selected = false;
});
// Random order of recipes
const recipeCollection = x.sort(function() {
    return 0.5 - Math.random()
});
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
            alert('Folgende Liste ist in die Zwischenablage kopiert:\n\n' + e.text)
        },
        onError: function(e) {
            alert('Fehler beim Kopieren in die Zwischenablage.')
        },
        accumulateRecipes: function(a) {
            // console.log("var a = array;", a.map(recipe => recipe.amount +recipe.name));
            // console.log("recipes", this.recipes);
            for (var i = 0; i < a.length; ++i) {
                // console.log("i", a[i].amount);
                for (var j = i + 1; j < a.length; ++j) {
                    // console.log("i", a[j].amount);
                    if (a[i].name === a[j].name && a[i].unit === a[j].unit) {
                        a[i].amount += a[j].amount;
                        // console.log("a.splice(j, 1);", a.splice(j, 1));
                        a.splice(j--, 1);
                    }
                }
            }
            return a;
        },
        sortIngredientsByDepartment: function(shoppingList) {
            // Create an array of departments

            let departments = shoppingList.map(ingredient => ingredient.department);
            // Remove duplicate departments
            departments = departments.filter(function(value, index, departments) {
                return departments.indexOf(value) == index;
            });
            departments.sort();

            sortedShoppingList = [];

            for (let index = 0; index < departments.length; index++) {
                let departmentShoppingList = [];
                for (let index2 = 0; index2 < shoppingList.length; index2++) {
                    if (departments[index] == shoppingList[index2].department) {
                        departmentShoppingList.push(shoppingList[index2]);
                    }
                }
                // Within a department sort the ingredients alphabetically by name
                sortedShoppingList.push(departmentShoppingList.sort(function compare(a, b) {
                    return (a.name <= b.name) ? -1 : 1;
                }));
            }
            return sortedShoppingList.concat.apply([], sortedShoppingList);

        }
    },
    computed: {
        shoppingList: function() {
            // console.log("this.recipes", this.recipes);
            let recipes = this.recipes;

            // Create an array with all the ingredients of the selected recipes
            let x = recipes.filter(recipe => recipe.selected == true).map(recipe => recipe.ingredients);
            console.log("x", x);
            let shoppingList = [].concat.apply([], x);
            console.log("shoppingList", shoppingList);
            // Accumulate similar ingredients
            console.log("shoppingList", shoppingList.map(recipe => recipe.amount + recipe.name));
            shoppingList = this.accumulateRecipes(shoppingList);

            shoppingList = this.sortIngredientsByDepartment(shoppingList);

            // Create an array with one string for each ingredient
            shoppingList = shoppingList.map(ingredient => ingredient.amount + " " + ingredient.unit + " " + ingredient.name);

            // console.log("shoppingList", shoppingList);

            return shoppingList;
        },
        clipboardShoppingList: function() {
            date = new Date();
            return "Einkaufsliste für den " + date.toLocaleDateString('de-DE', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) + ":\n" + this.shoppingList.join("\n");
        },
        clipboardMenues: function() {
            date = new Date();
            let a = "Menüliste ab dem " + date.toLocaleDateString('de-DE', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) + ":\n" + this.selectedRecipes.map(recipe => recipe.recipeName).join(", ").toUpperCase() + "\n\n";
            for (var i = 0; i < this.selectedRecipes.length; i++) {
                a += this.selectedRecipes[i].recipeName.toUpperCase() + "\n" + "--------------------" + "\n";
                for (var j = 0; j < this.selectedRecipes[i].ingredients.length; j++) {
                    a += this.selectedRecipes[i].ingredients[j].amount + this.selectedRecipes[i].ingredients[j].unit + ' ' + this.selectedRecipes[i].ingredients[j].name + "\n";
                }
                a += "\"" + this.selectedRecipes[i].comment + "\"" + "\n\n";
            }
            return a;
        },
        selectedRecipes: function() {
            return this.recipes.filter(recipe => recipe.selected == true);
        }
    }
});
