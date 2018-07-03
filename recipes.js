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
// Randem order of recipes
const recipeCollection = x.sort(function(a, b) {
    return 0.5 - Math.random()
});
console.log("recipeCollection:", recipeCollection);
/* --------------------------- */

/* ---- Function: removes duplicates from shoppingList and accumulates ingredients -- */
Array.prototype.unique = function() {
    var a = this;
    console.log("a", a);
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i].name === a[j].name && a[i].unit === a[j].unit) {
                console.log(a[i].name, a[j].name);
                console.log("a: ", a);
                console.log("a[i].amount += a[j].amount", a[i].amount, a[j].amount);
                a[i].amount += a[j].amount;
                a.splice(j--, 1);
            }
        }
    }
    return a;
};
/* ----------------------- */

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
    methods: {
        onCopy: function(e) {
            alert('You just copied: ' + e.text)
        },
        onError: function(e) {
            alert('Failed to copy texts')
        }
    },
    computed: {
        shoppingList: function() {
            console.log("shoppingList");
            let vm = this;
            let shoppingList = [];
            let x = vm.recipes.filter(recipe => recipe.selected == true).map(recipe => recipe.ingredients);
            shoppingList = [].concat.apply([], x);
            console.log("shoppingList", shoppingList);
            console.log("shoppingList.unique()", shoppingList.unique());
            shoppingList = shoppingList.map(ingredient => ingredient.amount + " " + ingredient.unit + " " + ingredient.name);
            console.log("shoppingList", shoppingList);
            return shoppingList;
        },
        clipboardShoppingList: function() {
            return this.shoppingList.join("\n");
        },
        selectedRecipes: function(shoppingList) {
            return this.recipes.filter(recipe => recipe.selected == true);
        }
    }
});