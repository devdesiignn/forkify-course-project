import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (recipeData) {
  const { recipe } = recipeData.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const recipeData = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(recipeData);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const searchData = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(searchData);

    state.search.results = searchData.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // Resetting the Page Number to 1
    state.search.currentPage = 1;

    // console.log(state.search.results);
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (
  pageNumber = state.search.currentPage
) {
  state.search.currentPage = pageNumber;

  const start = (pageNumber - 1) * state.search.resultsPerPage; // 0;
  const end = pageNumber * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (noOfServings) {
  state.recipe.ingredients.forEach(ing => {
    // Calculate New Quantity
    // new_Qt = old_Qt * new_Srv / old_Srv
    ing.quantity = (ing.quantity * noOfServings) / state.recipe.servings;
  });

  // Update Number of Servings
  state.recipe.servings = noOfServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add new Bookmark
  state.bookmarks.push(recipe);

  // Mark Current Recipe as BOOKMARKED
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Finding the Index of The Recipe with a Given ID
  const index = state.bookmarks.findIndex(element => element.id === id);

  // Delete Bookmark
  state.bookmarks.splice(index, 1);

  // Mark Current Recipe as NOT Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // console.log(storage);

  if (storage) state.bookmarks = JSON.parse(storage);
  // console.log(state.bookmarks);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        // const ingredientArray = ingredient[1].replaceAll(' ', '').split(',');
        const ingredientArray = ingredient[1].split(',').map(element => {
          element.trim();
        });

        if (ingredientArray.length !== 3)
          throw new Error(
            'Wrong ingredient Format! Please use the correct format :) '
          );

        const [quantity, unit, description] = ingredientArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    // console.log(recipe);

    const recipeData = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // console.log(recipeData);

    state.recipe = createRecipeObject(recipeData);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
