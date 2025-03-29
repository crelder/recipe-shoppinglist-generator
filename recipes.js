// Read JSON-File from Server
let importedRecipes;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        importedRecipes = JSON.parse(this.responseText);
    }
};

xmlhttp.open(
    "GET",
    "https://rawgit.com/crelder/recipe-shoppinglist-generator/master/recipes.json",
    false
);

xmlhttp.send();


// Use the hereby added recipe.selected Property to select/unselect recipes in the GUI 
// and to define the shopping list.
importedRecipes.forEach(function(recipe) {
    recipe.selected = false;
});

function getRecipeCollection() {
    let recipes = [];
    // We want to randomize the recipes, 
    // so that each time we look at it other recipes catch our attention 
    // therefore hopefully creating diversity in our nutrition.
    importedRecipes.sort(function() {
        return 0.5 - Math.random();
    });

    let uniquePriorities = getUniquePriorities();
    uniquePriorities.forEach(priority => {
        recipes.push(importedRecipes.filter(function(recipe) {
            return recipe.priority == priority;
        }));
    });
    // Flatten array
    recipes = [].concat(...recipes);

    return recipes;
}

function getUniquePriorities() {
    const priorities = importedRecipes.map(function(recipe) {
        return parseInt(recipe.priority);
    })
    let uniquePriorities = [...new Set(priorities)];
    return uniquePriorities.sort();
}

// Random order of recipes
const recipeCollection = getRecipeCollection();
/* --------------------------- */

function getIngredients(recipes) {
    const ingredients = {};

    recipes.forEach(receipe => {
        receipe.ingredients.forEach(ing => {
            // Create a unique key based on the ingredient name and unit
            const key = `${ing.name}|${ing.unit}`; // Use a delimiter to separate name and unit
            if (!ingredients[key]) {
                ingredients[key] = {
                    name: ing.name,
                    unit: ing.unit,
                    amount: ing.amount,
                    department: ing.department
                };
            } else {
                ingredients[key].amount += ing.amount; // Aggregate the amounts
            }
        });
    });

    return ingredients;
}

function getMenuList(recipies) {
    const date = new Date();
    let output = `Menu list starting from ${date.toLocaleDateString("en-EN", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric"
    })}:
${recipies.map(recipe => recipe.recipeName).join(", ").toUpperCase()}

`;

    for (let i = 0; i < recipies.length; i++) {
        output += `${recipies[i].recipeName.toUpperCase()}
--------------------
`;
        for (let j = 0; j < recipies[i].ingredients.length; j++) {
            output += `${recipies[i].ingredients[j].amount} ${recipies[i].ingredients[j].unit} ${recipies[i].ingredients[j].name}
`;
        }
        output += `\n"${recipies[i].comment} Priority ${recipies[i].priority}"\n\n\n`;
    }

    return output;
}

function sortIngredients(ingredients) {
    const list = Object.keys(ingredients).map(key => ({
        name: ingredients[key].name,
        unit: ingredients[key].unit,
        amount: ingredients[key].amount,
        department: ingredients[key].department
    }));

    // Sort by department first, then by name
    list.sort((l, r) => {
        if (l.department < r.department) {
            return -1; // l comes before r
        } else if (l.department > r.department) {
            return 1; // r comes before l
        } else {
            // If departments are the same, sort by name
            return l.name.localeCompare(r.name);
        }
    });

    return list.map(
        ing => `${ing.amount} ${ing.unit} ${ing.name}`
    );
}

function getSortedRecipies(selectedRecipes) {
    return selectedRecipes
        .sort((l, r) => (l.recipeName >= r.recipeName ? 1 : -1))
        .sort((l, r) => (l.priority >= r.priority ? 1 : -1));
}

/* --------- VUE component------------*/
Vue.component("my-meal", {
    props: ["recipe", "recipes", "index"],
    methods: {
        toggleSelectedRecipe: function() {
            this.recipes[this.index].selected = !this.recipes[this.index].selected;
        }
    },
    template:
        '<a href="javascript:void(0);" class="list-group-item list-group-item-action" v-bind:class="{active: recipes[index].selected}" v-on:click="toggleSelectedRecipe"> {{ recipe.recipeName }}</a>'
});

/* ---------- VUE instance ------------*/
var vm = new Vue({
    el: "#app",
    data: {
        recipes: recipeCollection
    },
    methods: {
        onCopy: function(info) {
            alert(`The following list has been copied to the clipboard:\n\n${info.text}`);
        },
        onError: function(error) {
            alert(`Error copying to the clipboard. ${error.text}`);
        }
    },
    computed: {
        shoppingList: function() {
            let selectedRecipes = this.recipes.filter(recipe => recipe.selected);
            const ingredients = getIngredients(selectedRecipes);
            return sortIngredients(ingredients);
        },
        clipboardShoppingList: function() {
            return `Shopping list for ${new Date().toLocaleDateString("en-EN", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric"
            })}:
${this.shoppingList.join("\n")}`;
        },
        clipboardMenues: function() {
            const selectedRecipes = this.recipes
                .filter(recipe => recipe.selected);
            const recipies = getSortedRecipies(selectedRecipes)
            return getMenuList(recipies)
        },
    }
});
