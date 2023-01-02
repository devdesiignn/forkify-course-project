// Importing icons
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. Recipe)
   * @param {boolean} [render=true] If false, create markup string instead of  rendering to DOM
   * @returns {undefined | string} A markup string is returned if Render is False
   * @this {Object} View Instance
   * @author DEVDESIIGNN
   * @todo Finsish Documentation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements);

    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    // console.log(currentElements);

    newElements.forEach((newElement, index) => {
      const currentElement = currentElements[index];

      // console.log(currentElement, newElement.isEqualNode(currentElement));

      // Update Changed TEXT
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('🌩', newElement.firstChild?.nodeValue.trim());
        currentElement.textContent = newElement.textContent;
      }

      // Update Changed ATTRIBUTES
      if (!newElement.isEqualNode(currentElement)) {
        // console.log(newElement.attributes);

        Array.from(newElement.attributes).forEach(attribute =>
          currentElement.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
