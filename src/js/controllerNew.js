
import "core-js/stable"
import "regenerator-runtime/runtime"

import * as model  from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import recipeView from "./views/recipeView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView"; 
import { MODEL_CLOSE_SEC } from "./config";

const recipeContainer = document.querySelector('.recipe');


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if(module.hot)
{
  module.hot.accept();
}


const controlRecipes=async function(){
  try{

    const id=window.location.hash.slice(1)
    console.log(id)
    console.log(model.state.bookmarks)

    if(!id) return
    recipeView.renderSpinner()

    //0) update results view to (mark selected) search result

      resultsView.update(model.getSearchResultsPage())
      bookmarksView.update(model.state.bookmarks)

    //1) Loadind Recipe
        
        await model.loadRecipe(id)

        
    //2)Rendering Recipe
          
        //   if we pass entire class ---const recipe =new recipeView(recipe)
          recipeView.render(model.state.recipe) //render method is created inside the class
  }
  catch(err){
    recipeView.renderError()
  }
}



const controlSearch=async function(){
  try{

    resultsView.renderSpinner()

    //Get search query from input field
    const searchQuery= searchView.getQuery()
    if(!searchQuery) return;

    //Load search Resuls
    await model.loadSearchResults(searchQuery)

    //render results
      // resultsView.render(model.state.search.results) - GET ALL RESULT
      resultsView.render(model.getSearchResultsPage());

    //render the intial pagination buttons  
     paginationView.render(model.state.search)
   
  }
  catch(err){
    console.log(err)
  }

}


const controlPagination=function(gotoPage){
  // render NEW results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //render the NEW pagination buttons  
   paginationView.render(model.state.search)
}


const controlServings=function(newServings){
  //update the recipe servings(in state)
    model.updateServings(newServings)
  //update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}



const controlAddbookmark=function()
{
  //Add or remove bookmark
  console.log(model.state.recipe)
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe)
  }
  else{
    model.deleteBookmark(model.state.recipe.id)
  }

  //update recipe view
  recipeView.update(model.state.recipe)

  //render bookmark
  bookmarksView.render(model.state.bookmarks)
} 



const controlBookmark=function()
{
  bookmarksView.render(model.state.bookmarks)
}


const controlAddRecipe=async function(newRecipe)
{
  try{

      addRecipeView.renderSpinner()

      //upload new Recipe data
      await model.uploadRecipe(newRecipe)
      
      //render Recipe
      recipeView.render(model.state.recipe)

      //success message
      addRecipeView.renderMessage()

      //Bookmarks view
      bookmarksView.render(model.state.bookmarks)
      
      //change id in URL
      window.history.pushState(null,"",`#${model.state.recipe.id}`);
      // window.history.back(); automatically going back to th previous page

      //close form window
      setTimeout(function(){
        addRecipeView.toogleWindow();
      },MODEL_CLOSE_SEC*1000)

  }
  catch(err)
  {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
  
}

const init=function(){

  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearch);

  paginationView.addHandlerClick(controlPagination);

  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddbookmark(controlAddbookmark);
  bookmarksView.addHandlerRender(controlBookmark)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()