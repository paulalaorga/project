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
const recipeList = document.getElementById('recipeList');
const selectedRecipeList = document.getElementById('selectedRecipeList');
const ingredientList = document.getElementById('ingredientList');
const shoppingList = document.getElementById('shoppingList');

const selectedRecipes = [];
const shoppingListItems = [];

// Function to display recipes in the recipe list
function displayRecipes(recipes) {
    recipeList.innerHTML = ''; 
    if (recipes) {
        recipes.forEach((recipe) => {
            const recipeItem = createRecipeListItem(recipe);
            recipeList.appendChild(recipeItem);
        });
    } else {
        recipeList.textContent = 'No recipes found.';
    }
}

// Function to create a list item for a recipe
function createRecipeListItem(recipe) {
    const recipeItem = document.createElement('li');
    recipeItem.textContent = recipe.strMeal;
    recipeItem.addEventListener('click', () => {
        selectRecipe(recipe);
    });
    return recipeItem;
}

// Function to select a recipe
function selectRecipe(recipe) {
    if (!selectedRecipes.includes(recipe)) {
        selectedRecipes.push(recipe);
        displaySelectedRecipes();
        displayIngredients(recipe);
    }
}

// Function to display selected recipes
function displaySelectedRecipes() {
    selectedRecipeList.innerHTML = '';
    selectedRecipes.forEach((recipe) => {
        const selectedRecipeItem = createRecipeListItem(recipe);
        selectedRecipeList.appendChild(selectedRecipeItem);
    });
}
// Function to fetch and display ingredients for a selected recipe
async function displayIngredients(recipe) {
    try {
        const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
        const ingredients = getIngredientsList(data.meals[0]);
        displayIngredientsList(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
}

// Function to extract ingredients from a recipe object
function getIngredientsList(recipe) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${measure} ${ingredient}`);
        } else {
            break; // No more ingredients
        }
    }
    return ingredients;
}

// Function to display ingredients in the ingredient list
function displayIngredientsList(ingredients) {
    ingredientList.innerHTML = '';
    if (ingredients.length > 0) {
        ingredients.forEach((ingredient) => {
            const ingredientItem = createIngredientListItem(ingredient);
            ingredientList.appendChild(ingredientItem);
        });
    } else {
        ingredientList.textContent = 'No ingredients found.';
    }
}

// Function to create a list item for an ingredient
function createIngredientListItem(ingredient) {
    const ingredientItem = document.createElement('li');
    ingredientItem.textContent = ingredient;
    ingredientItem.addEventListener('click', () => {
        addToShoppingList(ingredient);
    });
    return ingredientItem;
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

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') {
        fetchRecipes(query);
    }
});

// Function to display the shopping list
function displayShoppingList() {
    shoppingList.innerHTML = '';
    shoppingListItems.forEach((item) => {
        const shoppingListItem = document.createElement('li');
        shoppingListItem.textContent = item;
        shoppingList.appendChild(shoppingListItem);
    });

}
