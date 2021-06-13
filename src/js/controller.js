import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  // loading the recipe
  try {
    const id = window.location.hash.slice(1);
    // guard clause to prevent system from throwing an error if there's no ID
    if (!id) return;

    recipeView.renderSpinner();
    
    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);
    
    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (err) {
    recipeView.renderError(err);
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);
    
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
console.log('abc');
const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log('can you see me?', model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in url
    // pushState takes 3 argument, the first is called the state which isn't relevant
    // second one is called title, also not relevant
    // the final one is the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // we can move backwards of the url using window.history.back() 

    // close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎉', err);
    addRecipeView.renderError(err.message);
  };
};

const newFeature = function () {
  console.log('Welcome to the application');
};

// this is a better way of writing an event listener which fires the same function
// for some reason, parcel can't access array methods on array literals
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));
// so I just wrote this
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

// Publisher-Subscriber design pattern would help us move this code to the view
// and still have access to the controlRecipes without importing it into the view

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

// we need project architecture for 3 reasons
// structure
// maintainability
// expandability
// coming up with architectures on our own is only good for small projects
// for large projects we adopt the architectures like MVC, MVP (model view presenter), Flux, etc.
// frameworks like react, angular etc could also be used

// some components an architecture must have
// business logic: code that solves the actual business problem, like handling transactions
// state: stores any data or side effects from the front end browser
// HTTP Library: responsible for making and receiving AJAX requests
// application logic (router): related to the implementation of the application itself, like navigation and UI events
// presentation logic (UI layer): responsible for displaying the application state to the UI in order to keep things in sync

// we can break implement the above components in MVC
// Model: state, business logic, http library
// Controller: application logic, this acts as a bridge between the model and view which should know nothing about each other 
// View: presentation logic
// the model and view neither imports nor exports each other