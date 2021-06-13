// import icons from '../img/icons.svg'; // importing on parcel 1
import icons from 'url:../../img/icons.svg'; // importing on parcel 2
import { Fraction } from 'fractional';

export default class View {
    _data;

    // there's a standard way of writing documentations in javascript called JSDOCS
    // it is done by writing /** */ which automatically populates JSDOCS
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered
     * @param {boolean} [render=true] if false, create markup sting instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render is set to false
     * @this {Object} View instance
     * @author Kosisochukwu Afoenyi
     * @todo Finish implementation
     */

    // after documentation, if you hover over the function VScode displays the documentation
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
        // rendering the recipe
        // this.#parentElement.innerHTML = markup;
        if (!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl));

            // the method isEqualNode is not efficient on its own because it'll return elements, nodes and textContents

            // nodeValue returns null if it is an element or node
            // it only returns a value if it is a textContent, it doesn't return nodes and elements
            // update changed text
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
                // console.log('🎉', newEl.firstChild.nodeValue.trim());
            }

            // updates changed attributes
            if (!newEl.isEqualNode(curEl)) {
                console.log(Array.from(newEl.attributes));
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner () {
        const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        // this.#parentElement.innerHTML = markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        // parentEl.insertAdjacentHTML('afterbegin', markup);
    };

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
    };

    renderMessage(message = this._successMessage) {
        const markup = `
        <div class="error">
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
    };
}