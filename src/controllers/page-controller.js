import {render, unrender} from "../utils";
import {Position} from "../const";

import SearchController from "./search-controller";
import FilmListController from "./film-list-controller";

import Menu from "../components/menu";
import Sort from "../components/sort";
import Films from "../components/films";
import Search from "../components/search";
import FilmsList from "../components/films-list";
import MenuController from "../controllers/menu-controller";
import FilmsListContainer from "../components/films-list-container";

export default class PageController {
  constructor(container, cards) {
    this._headerElement = document.querySelector(`.header`);
    this._container = container;
    this._cards = cards;
    this._sort = new Sort();
    this._films = new Films();
    this._search = new Search();
    this._menu = new Menu(this._cards);
    this._filmsList = new FilmsList();
    this._searchController = new SearchController(this._container, this._search, this._cards);
    this._menuController = new MenuController(this._menu, this._container);
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
    this._topRatedContainer = new FilmsListContainer(`Top rated`, true);
    this._mostCommentedContainer = new FilmsListContainer(`Most commented`, true);
    this._filmListController = new FilmListController(this._mainFilmsContainer, this._cards);
    // this._commentsData = commentsData;
  }

  init() {
    render(this._headerElement, this._search.getElement(), Position.BEFOREEND);
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._topRatedContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._mostCommentedContainer.getElement(), Position.BEFOREEND);

    render(this._films.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    // this._searchController.init();
    this._menuController.init();
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

    this._menu.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.classList.contains(`main-navigation__item--active`)) {
        return;
      }

      this._menu.getElement().querySelectorAll(`.main-navigation__item`)
        .forEach((item) => item.classList.remove(`main-navigation__item--active`));

      evt.target.classList.add(`main-navigation__item--active`);
      const currentNavElement = evt.target.href.slice(evt.target.href.indexOf(`#`));

      unrender(this._mainFilmsContainer.getElement());
      this._mainFilmsContainer.removeElement();
      render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
      let filterCards;

      switch (currentNavElement) {
        case `#all`:
          filterCards = this._cards;
          break;
        case `#Watchlist`:
          filterCards = this._cards.filter((it) => {
            return it.isToWatchlist === true;
          });
          break;
        case `#History`:
          filterCards = this._cards.filter((it) => {
            return it.wasWatched === true;
          });
          break;
        case `#Favorites`:
          filterCards = this._cards.filter((it) => {
            return it.isFavorite === true;
          });
          break;
      }

      this._filmListController = new FilmListController(this._mainFilmsContainer, filterCards);
      this._filmListController.init();

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
