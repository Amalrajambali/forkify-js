import icons from "url:../../img/icons.svg"
import { RESULT_PER_PAGE } from "../config";

import View from "./view";

class AddRecipeView extends View{
    _parentElement=document.querySelector('.upload');

    _message="Recipe was succesfully uploaded"
   _window=document.querySelector(".add-recipe-window")
   _overlay=document.querySelector(".overlay ");
   _btnOpen=document.querySelector(".nav__btn--add-recipe")
   _btnClose=document.querySelector(".btn--close-modal")


   constructor()
   {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
   }

   
   toogleWindow()
   {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
   }
   _addHandlerShowWindow()
   {
      this._btnOpen.addEventListener("click",this.toogleWindow.bind(this))

   }

   _addHandlerHideWindow()
   {
      this._btnClose.addEventListener("click",this.toogleWindow.bind(this))

   }


   addHandlerUpload(handler)
   {
    this._parentElement.addEventListener("submit",(e)=>{
        e.preventDefault();
        const dataArr=[...new FormData(this._parentElement)]
        const data=Object.fromEntries(dataArr)
        handler(data)
    })
   }

    _generateMarkup()
    {
      

    }

}
export default new AddRecipeView()