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
    link: ''
    comment: ''
  ingredient:
    name:       ''
    unit:       ''
    amount:     0
    department: ''

Vue.component 'section-title',
  props: ['number', 'title']
  template: '#section-title'

  Vue.component 'recipe-item',
    props: [
      'recipe'
      'recipes'
      'index'
      'query'
    ]
    methods:
      toggleSelectedRecipe: -> @recipe.selected = !@recipe.selected
      deleteRecipe: (index)->
        s = @
        eModal.confirm 'This cannot be undone.', 'Are you sure?'
          .then -> s.recipes.splice index, 1
    template: '#recipe-item'

init = ->

  recipeCollection = ->
    x.forEach (recipe, index)->
      recipe.selected = no
      recipe.ingredients = azsort recipe.ingredients, 'name'
    recipes = azsort x, 'recipeName'
    store.set 'recipes', recipes
    recipes

  vm = new Vue
    el: '#app'
    data:
      recipes: do recipeCollection
      editindex: ''
      today: (new Date).toLocaleDateString 'en-AU',
        weekday: 'short'
        year: 'numeric'
        month: 'long'
        day: 'numeric'
      recipe:     clone templates.recipe
      ingredient: clone templates.ingredient
      ingForm: 'exist'
      units: ['mL', 'g', 'cup(s)', 'tsp(s)', 'pack(s)']
      query: ''

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
            @recipes[@editindex].link = @recipe.link
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

      onCopy: (e) -> eModal.alert
          subtitle: '(<kbd>Ctrl</kbd> + <kbd>v</kbd> to paste)'
          message: e.text.replace(///\n///g, '<br />')
        , 'Copied'
      onError: (e) -> mess.show 'Error copying to the clipboard.'

      handleFileSelect: (evt)->
        onload = (e)->
          @recipes = JSON.parse e.target.result
          mess.show 'Recipes loaded successfully.'
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
        records = do @prepareDBforDownload
        textToSaveAsBlob = new Blob [JSON.stringify @recipes, undefined, 2], type: 'text/json'
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
      selectedRecipesTitle: -> 
        s = @selectedRecipes.map (recipe)-> recipe.recipeName
        s.join ', '
          .toUpperCase()

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
        a = "Menu for #{ @today }:\n#{ @selectedRecipesTitle }\n\n"
        for recipe in @selectedRecipes
          a += "
            #{ recipe.recipeName.toUpperCase() }
            #{ if recipe.comment then '\n' + recipe.comment else '' }
            \n--------------------------------------------\n
          "
          for ingredient in recipe.ingredients
            a += "#{ ingredient.amount }#{ ingredient.unit } #{ ingredient.name }\n"
          a += '\n'
        a
