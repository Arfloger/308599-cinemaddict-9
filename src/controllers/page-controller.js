import {Position} from "../const";
import {render} from "../utils";
import FilmListController from "./film-list-controller";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsList from "../components/films-list";
import FilmsListContainer from "../components/films-list-container";

export default class PageController {
  constructor(container, cards, search) {
    this._container = container;
    this._cards = cards;
    this._sort = new Sort();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._search = search;
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
    this._topRatedContainer = new FilmsListContainer(`Top rated`, true);
    this._mostCommentedContainer = new FilmsListContainer(`Most commented`, true);
    this._filmListController = new FilmListController(this._mainFilmsContainer, this._cards);
    // this._commentsData = commentsData;
  }

  init() {
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._topRatedContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._mostCommentedContainer.getElement(), Position.BEFOREEND);

    render(this._films.getElement(), this._sort.getElement(), Position.AFTERBEGIN);

    this._filmListController.init();

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    this._search.getElement().querySelector(`input`)
    .addEventListener(`keyup`, (evt) => {
      if (evt.target.value.length >= 3) {
        this.hide();
      } else {
        this.show();
      }
    });

    this._search.getElement().querySelector(`.search__reset`)
    .addEventListener(`click`, () => {
      this.show();
    });

  }

  hide() {
    this._films.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._films.getElement().classList.remove(`visually-hidden`);
  }

  _onSortLinkClick(evt) {

    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._sort.getElement().querySelectorAll(`.sort__button`)
      .forEach((item) => item.classList.remove(`sort__button--active`));

    evt.target.classList.add(`sort__button--active`);
    this._mainFilmsContainer.getElement().querySelector(`.films-list__container`).innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-down`:
        this._cards.sort((a, b) => b.releaseDate - a.releaseDate);
        this._filmListController.init();
        break;
      case `rating-down`:
        this._cards.sort((a, b) => b.rating - a.rating);
        this._filmListController.init();
        break;
      case `default`:
        this._cards.sort((a, b) => a.filmId - b.filmId);
        this._filmListController.init();
        break;
    }

  }

}
