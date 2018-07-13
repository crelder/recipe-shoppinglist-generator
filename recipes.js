/* Read JSON-File from Server */
let x;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    x = JSON.parse(this.responseText);
  }
};

xmlhttp.open(
  "GET",
  "https://rawgit.com/crelder/recipe-shoppinglist-generator/master/recipes.json",
  false
);
xmlhttp.send();
// Use the hereby added recipe.selected Property to select/unselect recipes in the GUI and to define the shopping list.
x.forEach(function(recipe, index) {
  recipe.selected = false;
});
// Random order of recipes
const recipeCollection = x.sort(function() {
  return 0.5 - Math.random();
});
/* --------------------------- */

function filterSelectedMakeUnique(recipes) {
  const ings = {};

  recipes.filter(recipe => recipe.selected == true).forEach(receipe => {
    receipe.ingredients.forEach(ing => {
      if (!ings[ing.name]) {
        ings[ing.name] = {
          unit: ing.unit,
          amount: ing.amount,
          department: ing.department
        };
      } else {
        ings[ing.name].amount = ings[ing.name].amount + ing.amount;
      }
    });
  });

  return ings;
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
    onCopy: function(e) {
      alert("Folgende Liste ist in die Zwischenablage kopiert:\n\n" + e.text);
    },
    onError: function(e) {
      alert("Fehler beim Kopieren in die Zwischenablage.");
    }
  },
  computed: {
    shoppingList: function() {
      let recipes = this.recipes;
      const ingredients = filterSelectedMakeUnique(recipes);
      console.log("ingredients", JSON.stringify(ingredients, null, 2));
      const lst = Object.keys(ingredients).map(name => ({
        name: name,
        unit: ingredients[name].unit,
        amount: ingredients[name].amount,
        department: ingredients[name].department
      }));
      console.log("lst", JSON.stringify(lst, null, 2));
      const sortedByDepartment = lst.sort(
        (l, r) => (l.department <= r.department ? -1 : 1)
      );
      // console.log("sorted", JSON.stringify(sortedByDepartment, null, 2));

      return sortedByDepartment.map(
        ing => `${ing.amount} ${ing.unit} ${ing.name}`
      );
    },
    clipboardShoppingList: function() {
      date = new Date();
      return (
        "Einkaufsliste für den " +
        date.toLocaleDateString("de-DE", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) +
        ":\n" +
        this.shoppingList.join("\n")
      );
    },
    clipboardMenues: function() {
      date = new Date();
      let a =
        "Menüliste ab dem " +
        date.toLocaleDateString("de-DE", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) +
        ":\n" +
        this.selectedRecipes
          .map(recipe => recipe.recipeName)
          .join(", ")
          .toUpperCase() +
        "\n\n";
      for (var i = 0; i < this.selectedRecipes.length; i++) {
        a +=
          this.selectedRecipes[i].recipeName.toUpperCase() +
          "\n" +
          "--------------------" +
          "\n";
        for (var j = 0; j < this.selectedRecipes[i].ingredients.length; j++) {
          a +=
            this.selectedRecipes[i].ingredients[j].amount +
            this.selectedRecipes[i].ingredients[j].unit +
            " " +
            this.selectedRecipes[i].ingredients[j].name +
            "\n";
        }
        a += '"' + this.selectedRecipes[i].comment + '"' + "\n\n";
      }
      return a;
    },
    selectedRecipes: function() {
      return this.recipes.filter(recipe => recipe.selected == true);
    }
  }
});
