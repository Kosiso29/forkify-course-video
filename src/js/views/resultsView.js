import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; // importing on parcel 2

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again';
    _successMessage = '';

    _generateMarkup() {
        console.log(this._data);
        return this._data.map(result => previewView.render(result, false)).join('');
    };
}

export default new ResultsView();