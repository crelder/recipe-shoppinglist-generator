store = null
mess = null
x = null


clog = (args...)-> console.log args
clone = (mix)-> JSON.parse JSON.stringify mix
azsort = (arr, prop = null)->
  arr.sort (a, b)->
    if prop then a[prop].localeCompare b[prop]
    else a.localeCompare b

document.addEventListener 'DOMContentLoaded', ->
  store = new xStore 'ShoppingList', localStorage
  x = store.get('recipes') ? []
  mess = new Mess
  do mess.init
  do init

templates =
  recipe:
    recipeName: ''
    ingredients: []
    selected: no
    comment: ''
  ingredient:
    name:       ''
    unit:       ''
    amount:     0
    department: ''

init = ->
  el.classList.remove 'd-none' for el in document.querySelectorAll '.d-none'

  x.forEach (recipe, index)-> recipe.selected = no
  recipeCollection = azsort x, 'recipeName'

  Vue.component 'my-meal',
    props: [
      'recipe'
      'recipes'
      'index'
    ]
    methods:
      toggleSelectedRecipe: -> @recipes[@index].selected = !@recipes[@index].selected
      deleteRecipe: (index)->
        s = @
        eModal.confirm 'This cannot be undone.', 'Are you sure?'
          .then -> s.recipes.splice index, 1
    template: '''
      <li
        class="list-group-item list-group-item-action"
        v-bind:data-index="index"
        v-bind:class="{selected: recipes[index].selected}"
        v-on:click="toggleSelectedRecipe"
      >
        <i class="mr-2 fas fa-trash text-danger" @click.stop="deleteRecipe(index)"></i>
        <i class="mr-2 fas fa-pen text-warning" @click.stop="$emit('update')"></i>
        <i class="far fa-lg fa-square" v-show="!recipes[index].selected"></i>
        <i class="fas fa-lg fa-check-square text-primary" v-show="recipes[index].selected"></i>
        {{ recipe.recipeName }}
      </li>'''

  vm = new Vue
    el: '#app'
    data:
      recipes: recipeCollection
      editindex: ''
      today: (new Date).toLocaleDateString 'en-AU',
        weekday: 'short'
        year: 'numeric'
        month: 'long'
        day: 'numeric'
      recipe:     clone templates.recipe
      ingredient: clone templates.ingredient
      ingForm: 'exist'
      units: ['', 'mL', 'g', 'pack(s)']
    methods:

      addIngredient: ->
        if @ingredient.name is '' then mess.show 'Ingredient name cannot be empty'
        else if @ingredient.department is '' then mess.show 'Please input department name'
        else
          @recipe.ingredients.push
            name:       @ingredient.name
            unit:       @ingredient.unit
            amount:     parseFloat @ingredient.amount
            department: @ingredient.department
          do @clearIngredient
      deleteIngredient: (index)-> @recipe.ingredients.splice index, 1
      clearIngredient: ->
        @ingredient = clone templates.ingredient
      clearIngredientName: ->
        @ingredient.name = ''
        @ingredient.department = ''
      updateIngredientTexts: (e)->
        selected = e.target.querySelector ':checked'
        @ingredient.name = selected.value
        @ingredient.department = selected.dataset.department

      addRecipe: ->
        if @recipe.recipeName is '' then mess.show 'Recipe name cannot be empty'
        else if @recipe.ingredients.length is 0 then mess.show 'Add some ingredients first'
        else
          if @editindex isnt ''
            @recipes[@editindex].recipeName = @recipe.recipeName
            @recipes[@editindex].ingredients = @recipe.ingredients
            @recipes[@editindex].comment = @recipe.comment
            mess.show "Updated recipe: #{@recipe.recipeName}"
          else
            @recipes.push clone @recipe
            mess.show "Added new recipe: #{@recipe.recipeName}"
          do @clearRecipe
      clearRecipe: ->
        @recipe = clone templates.recipe
        do @clearIngredient
        @editindex = ''
      updateRecipe: (index, recipe)->
        @recipe[k] = v for k, v of recipe
        @editindex = index

      uniqueIngredients: (recipes = @recipes)->
        ings = {}
        recipes.forEach (recipe)->
          recipe.ingredients.forEach (ing)->
            ings[ing.department] = {} if not ings[ing.department]
            if not ings[ing.department][ing.name]
              ings[ing.department][ing.name] =
                unit:       ing.unit
                amount:     ing.amount
                department: ing.department
            else
              ings[ing.department][ing.name].amount += ing.amount
        # alphabetise everything
        ordered = {}
        for d in azsort Object.keys ings
          ordered[d] = {}
          ordered[d][i] = ings[d][i] for i in azsort Object.keys ings[d]
        ordered

      onCopy: (e) -> eModal.alert e.text.replace(///\n///g, '<br />'), 'Copied (Ctrl + v to paste):'
      onError: (e) -> mess.show 'Error copying to the clipboard.'

      handleFileSelect: (evt)->
        onload = (e)-> @recipes = JSON.parse e.target.result
        # https://www.html5rocks.com/en/tutorials/file/dndfiles/
        reader = new FileReader
        reader.onload = onload.bind @
        reader.readAsBinaryString evt.target.files[0]
      prepareDBforDownload: (arr = @recipes)->
        clone arr
          .map (e)->
            delete e.selected
            delete e.index
      exportRecipes: ->
        records = do prepareDBforDownload
        textToSaveAsBlob = new Blob [JSON.stringify @recipesSorted, undefined, 2], type: 'text/json'
        downloadLink = document.createElement 'a'
        downloadLink.download = 'recipes.json'
        downloadLink.innerHTML = 'Download File'
        downloadLink.href = window.URL.createObjectURL textToSaveAsBlob
        downloadLink.onclick = (e)-> document.body.removeChild e.target
        downloadLink.style.display = 'none'
        document.body.appendChild downloadLink
        do downloadLink.click

    computed:
      selectedRecipes: -> @recipes.filter (recipe)-> recipe.selected is yes
      recipesSorted: ->
        store.set 'recipes', @recipes
        azsort @recipes, 'recipeName'
      ingredientList: -> do @uniqueIngredients
      departmentList: -> Object.keys do @uniqueIngredients

      clipboardShoppingList: ->
        a = "Shopping list for #{@today}:\n\n"
        departments = @uniqueIngredients @selectedRecipes
        for department, ingredients of departments
          a += "#{department}:\n"
          a += "#{ing.amount}#{ing.unit} #{ingName}\n" for ingName, ing of ingredients
          a += '\n'
        a
      clipboardMenues: ->
        a = "Menu for #{@today}:\n" + @selectedRecipes
          .map (recipe)-> recipe.recipeName
          .join ', '
          .toUpperCase()
        a += '\n\n'
        for recipe in @selectedRecipes
          a += recipe.recipeName.toUpperCase() + '\n--------------------------------------------\n'
          for ingredient in recipe.ingredients
            a += "#{ingredient.amount}#{ingredient.unit} #{ingredient.name}\n"
          a += "#{recipe.comment}\n\n"
        a
