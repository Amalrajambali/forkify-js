import icons from "url:../../img/icons.svg"
import { RESULT_PER_PAGE } from "../config";

import View from "./view";

class PaginationView extends View{
    _parentElement=document.querySelector('.pagination');
    _errormessage="No recipe Found for your query...💥Please try another one!!!! ";
    _message="";


    addHandlerClick(handler)
    {
        this._parentElement.addEventListener("click",function(e){
           const btn= e.target.closest(".btn--inline ");

            if(!btn) return ""

            const goTopage= +btn.dataset.goto
            handler(goTopage);
        })
    }

    _generateMarkup()
    {
        const currentPage=this._data.page
        const numPages= Math.ceil(this._data.results.length/this._data.resultsPerpage)
        console.log(numPages);

        //page 1 and there are other pages
        if(currentPage===1 && numPages>1)
        {
            return `
                <button data-goto="${currentPage+1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage+1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
             `
        }

        //Last page
        if(currentPage===numPages && numPages>1)
        {
            return `
            <button data-goto="${currentPage-1}"class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
          `
        }

        //Other page
        if(currentPage< numPages)
        {
             return `
              <button data-goto="${currentPage-1}"class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
              </button>

              <button data-goto="${currentPage+1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
             </button>
             `
        }
        //page 1 and there are NO other pages
        return ""

    }

}
export default new PaginationView()