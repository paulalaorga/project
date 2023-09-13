const apiKey = '1';

async function fetchRecipes(query) {
    try {
        const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}&apiKey=${apiKey}`);
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');

const recipeList = document.getElementById('recipeList');
const selectedRecipeList = document.getElementById('selectedRecipeList');
const ingredientList = document.getElementById('ingredientList');
const shoppingList = document.getElementById('shoppingList');


const selectedRecipes = []; // My Menu array
const shoppingListItems = []; // My Shopping List

// Event listener for the search button and clear button
searchButton.addEventListener('click',  () => {
    const query = searchInput.value.trim();
    if (query !== '') {
        fetchRecipes(query);
    }
});

searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query !== '') {
            fetchRecipes(query);
        }
    }
});

 clearButton.addEventListener('click', function() {
     displayRecipes(), displayIngredientsList() = '';
 });


 // Functions to create and display list of recipes

function createRecipeList(recipe) {
    const recipeItem = document.createElement('li');
    recipeItem.textContent = recipe.strMeal;
    recipeItem.addEventListener('click', () => {
        selectRecipe(recipe);
    });
    return recipeItem;
}

function displayRecipes(recipes) {
    recipeList.innerHTML = ''; 
    if (recipes) {
        recipes.forEach((recipe) => {
            const recipeItem = createRecipeList(recipe);
            recipeList.appendChild(recipeItem);
        });
    } 
}



// Functions to select and display My Menu

function selectRecipe(recipe) {
    if (!selectedRecipes.includes(recipe)) {
        selectedRecipes.push(recipe);
        displaySelectedRecipes();
        displayIngredients(recipe);
    }
}

function displaySelectedRecipes() {
    selectedRecipeList.innerHTML = '';
    selectedRecipes.forEach((recipe) => {
        const selectedRecipeItem = createRecipeList(recipe);
        selectedRecipeList.appendChild(selectedRecipeItem);
    });
}

// Function to fetch and display ingredients for each recipe

async function displayIngredients(recipe) {
    try {
        const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
        const ingredients = getIngredientsList(data.meals[0]);
        displayIngredientsList(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
}

// Function to extract the ingredients from the recipe object

function getIngredientsList(recipe) {
    const ingredients = []; // Ingredients array
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${measure} ${ingredient}`);
        } else {
            break; 
        }
    }
    return ingredients;
}

// Functions to create and display the list of ingredients per recipe

function createIngredientList(ingredient) {
    const ingredientItem = document.createElement('li');
    ingredientItem.textContent = ingredient;
    ingredientItem.addEventListener('click', () => {
        addToShoppingList(ingredient); // Adds Ingredient to Shopping list
    });
    return ingredientItem;
}

function displayIngredientsList(ingredients) {
    ingredientList.innerHTML = '';
    if (ingredients.length > 0) {
        ingredients.forEach((ingredient) => {
            const ingredientItem = createIngredientList(ingredient);
            ingredientList.appendChild(ingredientItem);
        });
    } 
}

// Function to add selected ingredients to the shopping list
function addToShoppingList(ingredient) {
    if (!shoppingListItems.includes(ingredient)) {
        shoppingListItems.push(ingredient);
        displayShoppingList();
    }
}

// Function to display the shopping list
function displayShoppingList() {
    shoppingList.innerHTML = '';
    shoppingListItems.forEach((item) => {
        const shoppingListItem = document.createElement('li');
        shoppingListItem.textContent = item;
        shoppingList.appendChild(shoppingListItem);
    });
}

