import { API_URL, API_KEY,RESULT_PER_PAGE } from "./config"
import { getJson,sendJson,AJAX } from "./views/helper"

export const state={
    recipe:{},
    search:{
      query:"",
      results:[],
      page:1,
      resultsPerpage:RESULT_PER_PAGE
    },
    bookmarks:[],
}



const createRecipeObject=function(data)
{
  const {recipe}=data.data;

  return {
    id : recipe.id,
    title : recipe.title,
    publisher : recipe.publisher,
    sourceUrl :  recipe.source_url,
    image : recipe.image_url,
    servings : recipe.servings,
    cookingTime : recipe.cooking_time,
    ingredients : recipe.ingredients,
    ...(recipe.key && {key :recipe.key})
  }
}

//Load-recipe
export const loadRecipe=async function(id){
    try{
        
        const data= await AJAX(`${API_URL}${id}?key=${API_KEY}`)

        //re factor the api data by removing the underScore between them
      
        state.recipe=createRecipeObject(data)

        if(state.bookmarks.some(bookmark=>bookmark.id===id)) {
          
          state.recipe.bookmarked=true;
           
        }
        else{
          state.recipe.bookmarked=false;
        }

    }

    catch(err){
      //temp error handling
        console.error(`${err}💥💥`)
        throw err
    }  

}


//Search-result
export const loadSearchResults=async function(querysearch)
{
    try{
      state.search.query=querysearch;
      const data = await AJAX(`${API_URL}?search=${querysearch}&key=${API_KEY}`);
      console.log(data);

      state.search.results=data.data.recipes.map((rec)=>{
        return {
          id : rec.id,
          title : rec.title,
          publisher : rec.publisher,
          image : rec.image_url,
          ...(rec.key && {key :rec.key})
        }

      })

      state.search.page=1;
    }
    catch(err)
    {
      console.error(`${err}💥💥`)
      throw err 
    }

}

//Search per page
export const getSearchResultsPage=function(page=state.search.page){

    state.search.page=page

    const start=(page-1)*state.search.resultsPerpage; //0
    const end=page*state.search.resultsPerpage; //9

  return state.search.results.slice(start,end);
}

//update the  newservings
export const updateServings=function(newServings)
{
 state.recipe.ingredients.forEach(ing => {

    //newQty = ( oldQty * newSev ) / old srevings
    ing.quantity=(ing.quantity*newServings) / state.recipe.servings;
 });

 state.recipe.servings=newServings;
}

//bookmark

  export const persistBookmark=function()
  {
    localStorage.setItem("bookmark",JSON.stringify(state.bookmarks))
  }

  export const addBookmark=function(recipe){
    //Add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if(recipe.id===state.recipe.id) 
    {
      state.recipe.bookmarked=true
    };

    persistBookmark();
  }


  export const deleteBookmark=function(id){

    //Delete bookmark
    const index=state.bookmarks.findIndex(el=>el.id===id)
    const data= state.bookmarks.splice(index,1)

    //mark current recipe as NO bookmark
    if(id===state.recipe.id)  
    {
      state.recipe.bookmarked=false;
    };

    persistBookmark();
  }

  const init=function(){
    const storage=localStorage.getItem("bookmark")

    if(storage) state.bookmarks=JSON.parse(storage)
  }


  init();

  const clearBookmarks=function()
  {
    localStorage.clear("bookmark")
  }

  // clearBookmarks();



 //Recipe upload

 export const uploadRecipe=async function(newRecipe){

  try{
        const ingredients=Object.entries(newRecipe)
        .filter(entry=>entry[0].startsWith("ingredient") && entry[1]!="")
        .map(ing=>{
          // const ingArr=ing[1].replaceAll(" ","").split(",")
          const ingArr=ing[1].split(",").map(el=>el.trim())
          if(ingArr.length!==3) {

            throw new Error("Wrong ingredient format use the correct format:");
          }
          const [quantity,unit,description]=ingArr;
          return  { quantity:quantity ? +quantity:null ,unit,description}
        })

    console.log(ingredients);


    const recipe={
        title:newRecipe.title,
        source_url:newRecipe.sourceUrl,
        image_url:newRecipe.image,
        servings:+newRecipe.servings,
        publisher:newRecipe.publisher,
        cooking_time:+newRecipe.cookingTime,
        ingredients,
      }

      console.log(recipe);

      const data= await AJAX(`${API_URL}?key=${API_KEY}`,recipe)
      state.recipe=createRecipeObject(data)
      addBookmark(state.recipe)
      console.log(data)
  }
  catch(err)
  {
    throw err;
  }

 }