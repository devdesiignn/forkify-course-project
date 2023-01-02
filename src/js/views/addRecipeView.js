import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = `Recipe was successfully uploaded. 🎉🎉`;

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _buttonOpen = document.querySelector('.nav__btn--add-recipe');
  _buttonClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggle() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggle.bind(this));
  }

  _addHandlerHideWindow() {
    this._buttonClose.addEventListener('click', this.toggle.bind(this));
    this._overlay.addEventListener('click', this.toggle.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();

      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
