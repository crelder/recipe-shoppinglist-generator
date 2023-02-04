# recipe-shoppinglist-generator

## Run
https://crelder.github.io/recipe-shoppinglist-generator/

Select at least one meal and scroll to the very bottom.

## Solves two problems
1. I go shopping and do not know which ingredients I should buy - I always forget which recipes/meals I can cook.
2. I am at home and want to cook a particular meal, but I do not have all the necessary ingredients.

## Input
Select the meals you want to cook from a recipe list.

Meals are ordered by priority. "Priority 1" meals (e.g., healthy meals) will appear at the top of the list. "Priority 2" meals will appear below that. 

Each group displays recipes in random order. 

## Output
Accumulated list with ingredients you need to buy in order to cook the selected meals.
The ingredient list is sorted by supermarket departments.

Workflow: Copy the shopping list into memories (Mac), Wunderlist or any other tool that helps you during your shopping trip.

Recipe explanations can be concise, because the contained recipes are your own recipes you know very well.

## Use your own recipes
1. Clone this repository.
2. Change the `recipes.json` file so that it fits your own recipes. Then check e.g. [here](https://jsonformatter.curiousconcept.com/#), if your `recipes.json` content has a valid json format.
2. Copy the location of your raw version of your `recipes.json` into line 9 in the `recipes.js` file.
3. Use Github Pages to create an application link. 
4. Bookmark this link and you can always generate your shoppinglist on the go. 

Done!
