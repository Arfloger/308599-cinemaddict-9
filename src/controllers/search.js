import {Position, Mode} from "../const";
import {render} from "../utils";
import SearchResult from "../components/search-result";
import BoardController from "../controllers/board";

export default class SearchController {
  constructor(container, search) {
    this._headerElement = document.querySelector(`.header`);
    this._container = container;
    this._cards = [];
    this._searchCards = [];
    this._count = 0;
    this._search = search;
    this._searchResult = new SearchResult(this._count);
    this._boardController = new BoardController(this._container, Mode.SEARCH);
  }

  init(cards) {
    this._cards = cards;
    this._searchCards = Object.assign([], this._cards);
    render(this._headerElement, this._search.getElement(), Position.BEFOREEND);
    render(this._container, this._searchResult.getElement(), Position.AFTERBEGIN);
    this._search.getElement().querySelector(`input`)
    .addEventListener(`keyup`, (evt) => this._onSearchKeyPress(evt));
  }

  show() {
    this._searchResult.getElement().classList.remove(`visually-hidden`);
    this._boardController.show();
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
    this._boardController.hide();
  }

  _onSearchKeyPress(evt) {
    if (evt.target.value.length >= 3) {
      this._boardController.unrender();
      const {value} = evt.target;
      const searchCards = this._searchCards.filter((card) => {
        return card.filmInfo.title.toLowerCase().includes(value.toLowerCase()
          .split(`.`).join(``)
          .split(`,`).join(``)
          .split(`!`).join(``)
          .split(`?`).join(``)
          .split(`:`).join(``)
          .split(`;`).join(``)
          .split(`)`).join(``)
          .split(`(`).join(``)
          .split(`'`).join(``)
          .split(`"`).join(``));
      });

      this._count = searchCards.length;
      this._searchResult.getElement().querySelector(`.result__count`).textContent = this._count;
      this._boardController.showCards(searchCards);
    }
  }
}
