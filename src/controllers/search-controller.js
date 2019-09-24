import {Position} from "../const";
import {render} from "../utils";
import FilmListController from "./film-list-controller";
import Films from "../components/films";
import FilmsList from "../components/films-list";
import FilmsListContainer from "../components/films-list-container";
import SearchResult from "../components/search-result";

export default class SearchController {
  constructor(container, search, cards) {
    this._container = container;
    this._search = search;
    this._cards = cards;
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._count = 0;
    this._searchResult = new SearchResult(this._count);
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
  }

  init() {
    this.hide();
    this._searchResult.getElement().classList.add(`visually-hidden`);
    render(this._container, this._searchResult.getElement(), Position.BEFOREEND);
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);

    this._search.getElement().querySelector(`input`)
    .addEventListener(`keyup`, (evt) => {
      if (evt.target.value.length >= 3) {
        const {value} = evt.target;
        const searchCards = this._cards.filter((card) => {
          return card.title.toLowerCase().includes(value.toLowerCase()
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
        this._searchResult.getElement().classList.remove(`visually-hidden`);
        this.show();

        const filmListController = new FilmListController(this._mainFilmsContainer, searchCards);
        this._count = searchCards.length;

        this._searchResult.getElement().querySelector(`.result__count`).textContent = this._count;

        filmListController.init();
      } else {
        this._searchResult.getElement().classList.add(`visually-hidden`);
        this.hide();
      }
    });

    this._search.getElement().querySelector(`.search__reset`)
    .addEventListener(`click`, () => {
      this.hide();
      this._searchResult.getElement().classList.add(`visually-hidden`);
    });
  }

  hide() {
    this._films.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._mainFilmsContainer.getElement().querySelector(`.films-list__container`).innerHTML = ``;
    this._films.getElement().classList.remove(`visually-hidden`);
  }
}
