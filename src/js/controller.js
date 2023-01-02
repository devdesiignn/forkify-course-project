import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SECS } from './config.js';

import 'core-js/stable'; // Polyfilling to Everything to ES5
import 'regenerator-runtime/runtime'; // Polyfilling Async/Await to ES5

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // Fetch ID
    const id = window.location.hash.slice(1);

    // Guard Clause
    if (!id) return;

    // Render Spinner
    recipeView.renderSpinner();

    // 0) Update Results View to Mark Selected Search Result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating The Bookmark View
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading Recipe
    await model.loadRecipe(id);

    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Render Spinner
    resultsView.renderSpinner();

    // Fetch Search Query
    const query = searchView.getQuery();

    // Guard Clause
    if (!query) return;

    // 0) Loading Search Results
    await model.loadSearchResults(query);

    // 1A) Render ALL Results
    // resultsView.render(model.state.search.results);

    // 1B) Render 10 Results
    resultsView.render(model.getSearchResultsPage(1));

    // 2) Render Initial Pagination Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    // Temp error handling
    console.error(`${error} ⚡`);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (noOfServings) {
  // 1) Update Recipe Servings (in State)
  model.updateServings(noOfServings);

  // 2) Update the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add / Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update the Recipe View
  recipeView.update(model.state.recipe);

  // console.log(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);

    // Render Spinner
    addRecipeView.renderSpinner();

    // Upload Recipe
    await model.uploadRecipe(newRecipe);

    // console.log('Model.state.recipe', model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render Success Message
    addRecipeView.renderSuccess();

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggle();
    }, MODAL_CLOSE_SECS * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const newFeature = function () {
  console.log(`Welcome to The Application!`);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
