import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const clickedBtn = event.target.closest('.btn--inline');
      if (!clickedBtn) return;
      //   console.log(clickedBtn);

      const goToPage = +clickedBtn.dataset.goto;
      //   console.log(goToPage);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    // @ Page 1 and There are other Pages
    if (this._data.currentPage === 1 && numPages > 1)
      return `
    <button data-goto="${
      this._data.currentPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;

    // @ Other Page
    if (this._data.currentPage < numPages)
      return `
    <button  data-goto="${
      this._data.currentPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.currentPage - 1}</span>
    </button>

    <button  data-goto="${
      this._data.currentPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
`;

    // @ Last Page
    if (this._data.currentPage === numPages && numPages > 1)
      return `
    <button  data-goto="${
      this._data.currentPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.currentPage - 1}</span>
    </button>
    `;

    // @ Page 1 and There are NO other Pages
    return ``;
  }
}

export default new PaginationView();
