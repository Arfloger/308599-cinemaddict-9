import {AUTHORIZATION, END_POINT, Position, Mode} from "../const";
import {render, unrender} from "../utils";

import API from "../api/api";
import StatisticController from "../controllers/statistic";
import BoardController from "../controllers/board";
import SearchController from "../controllers/search";
import ProfileController from "../controllers/profile";

import Filter from "../components/filter";
import Search from "../components/search";

export default class PageController {
  constructor() {
    this._container = document.querySelector(`.main`);
    this._cards = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._filter = null;
    this._filterMode = `#all`;
    this._userTitle = ``;

    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._statisticController = new StatisticController(this._container);
    this._boardController = new BoardController(this._container, Mode.DEFAULT, this._onDataChange);
    this._profileController = new ProfileController();
    this._search = new Search();
    this._searchController = new SearchController(this._container, this._search);
  }

  init() {
    this._api.getCards()
          .then((cards) => {
            this._cards = cards;
            this._boardController.showCards(this._cards);
            this._searchController.init(this._cards);
            this._searchController.hide();
            this._setFooterStatistics(this._cards);
            this._profileController.init(this._getUserTitle(cards));

            this._renderFilter(this._cards);

            this._search.getElement().querySelector(`input`).addEventListener(`keyup`, this._onSearchInputKeydown.bind(this));

            this._search.getElement().querySelector(`.search__reset`).addEventListener(`click`, this._showMainScreen.bind(this));

          });
  }

  _setFooterStatistics(cards) {
    const footerStatisticElement = document.querySelector(`.footer__statistics p`);
    footerStatisticElement.textContent = `${cards.length} movies inside`;
  }

  _unrenderFilter() {
    unrender(this._filter.getElement());
    this._filter.removeElement();
  }

  _renderFilter(cards) {
    this._filter = new Filter(cards);
    render(this._container, this._filter.getElement(), Position.AFTERBEGIN);

    this._filter.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.classList.contains(`main-navigation__item--active`)) {
        return;
      }

      let filterCards = Object.assign([], cards);

      this._filter.getElement().querySelector(`[href="${this._filterMode}"]`).classList.remove(`main-navigation__item--active`);

      evt.target.classList.add(`main-navigation__item--active`);
      const currentNavElement = evt.target.href.slice(evt.target.href.indexOf(`#`));

      switch (currentNavElement) {
        case `#stats`:
          this._filterMode = `#stats`;
          this._statisticController.show(this._cards, this._userTitle);
          this._searchController.hide();
          this._boardController.hide();
          break;
        case `#all`:
          this._filterMode = `#all`;
          this._showMainScreen();
          break;
        case `#Watchlist`:
          this._filterMode = `#Watchlist`;
          this._showMainScreen();
          break;
        case `#History`:
          this._filterMode = `#History`;
          this._showMainScreen();
          break;
        case `#Favorites`:
          this._filterMode = `#Favorites`;
          this._showMainScreen();
          break;
      }

      this._boardController.showCards(this._getFilteredCards(filterCards, this._filterMode));

    });
  }

  _getFilteredCards(cards, mode) {

    let filterCards;

    switch (mode) {
      case `#stats`:
        break;
      case `#all`:
        filterCards = cards;
        break;
      case `#Watchlist`:
        filterCards = cards.filter((it) => it.userDetails.watchlist);
        break;
      case `#History`:
        filterCards = cards.filter((it) => it.userDetails.alreadyWatched);
        break;
      case `#Favorites`:
        filterCards = cards.filter((it) => it.userDetails.favorite);
        break;
    }

    return filterCards;
  }

  _getUserTitle(cards) {
    let watchedCount = 0;

    cards.forEach((card) => {
      watchedCount = card.userDetails.alreadyWatched ? watchedCount += 1 : watchedCount;
    });

    switch (true) {
      case watchedCount === 0:
        this._userTitle = ``;
        break;
      case watchedCount <= 10:
        this._userTitle = `novice`;
        break;
      case watchedCount <= 20:
        this._userTitle = `fan`;
        break;
      case watchedCount > 20:
        this._userTitle = `movie buff`;
        break;
      default:
        this._userTitle = ``;
    }

    return this._userTitle;

  }

  _onSearchInputKeydown(evt) {
    if (evt.target.value.length >= 3) {
      this._searchController.show();
      this._statisticController.hide();
      this._boardController.hide();
    } else {
      this._boardController.show();
      this._searchController.hide();
      this._statisticController.hide();
    }
  }

  _showMainScreen() {
    this._boardController.show();
    this._searchController.hide();
    this._statisticController.hide();
  }

  _onDataChange(newData) {
    this._api.updateCard({
      id: newData.id,
      data: newData.toRAW(),
    })
      .then(() => this._api.getCards())
      .then((cards) => {
        this._cards = cards;

        this._profileController.unrender();
        this._profileController.init(this._getUserTitle(cards));
        this._unrenderFilter();
        this._renderFilter(cards);
        this._getFilteredCards(this._cards, this._filterMode);
        this._filter.getElement().querySelector(`[href="${this._filterMode}"]`).classList.add(`main-navigation__item--active`);
      });
  }
}

