import {AUTHORIZATION, END_POINT, Position, Mode, FilterName, UserRating} from "../const";
import {render, unrender} from "../utils";

import API from "../api/api";
import StatisticController from "../controllers/statistic";
import BoardController from "../controllers/board";
import SearchController from "../controllers/search";
import ProfileController from "../controllers/profile";

import Filter from "../components/filter";
import Search from "../components/search";
import Loading from "../components/loading";

export default class PageController {
  constructor() {
    this._container = document.querySelector(`.main`);
    this._cards = [];
    this._filter = null;
    this._filterMode = `#all`;
    this._userTitle = ``;
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._onDataChange = this._onDataChange.bind(this);
    this._statisticController = new StatisticController(this._container);
    this._boardController = new BoardController(this._container, Mode.DEFAULT, this._onDataChange, this._api);
    this._loading = new Loading();
    this._profileController = new ProfileController();
    this._search = new Search();
    this._searchController = new SearchController(this._container, this._search);
    this._isLoading = false;
  }

  init() {
    render(this._container, this._loading.getElement(), Position.BEFOREEND);
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

            this._isLoading = true;

            if (this._isLoading) {
              unrender(this._loading.getElement());
              this._loading.removeElement();
            }

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

    this._filter.getElement().querySelector(`[href="${this._filterMode}"]`).classList.add(`main-navigation__item--active`);

    this._filter.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.classList.contains(`main-navigation__item--active`)) {
        return;
      }

      let filterCards = cards.slice();

      this._filter.getElement().querySelector(`[href="${this._filterMode}"]`).classList.remove(`main-navigation__item--active`);

      evt.target.classList.add(`main-navigation__item--active`);
      const currentNavElement = evt.target.href.slice(evt.target.href.indexOf(`#`));

      switch (currentNavElement) {
        case FilterName.STATS:
          this._filterMode = FilterName.STATS;
          this._statisticController.show(filterCards, this._userTitle);
          this._searchController.hide();
          this._boardController.hide();
          if (document.querySelector(`.films + .no-result`)) {
            document.querySelector(`.films + .no-result`).remove();
          }
          return;
        case FilterName.ALL:
          this._filterMode = FilterName.ALL;
          this._showMainScreen();
          break;
        case FilterName.WATCHLIST:
          this._filterMode = FilterName.WATCHLIST;
          this._showMainScreen();
          break;
        case FilterName.HISTORY:
          this._filterMode = FilterName.HISTORY;
          this._showMainScreen();
          break;
        case FilterName.FAVORITES:
          this._filterMode = FilterName.FAVORITES;
          this._showMainScreen();
          break;
      }

      this._boardController.showCards(this._getFilteredCards(filterCards, this._filterMode));

    });
  }

  _getFilteredCards(cards, mode) {

    let filterCards;

    switch (mode) {
      case FilterName.STATS:
        break;
      case FilterName.ALL:
        filterCards = cards;
        break;
      case FilterName.WATCHLIST:
        filterCards = cards.filter((it) => it.userDetails.watchlist);
        break;
      case FilterName.HISTORY:
        filterCards = cards.filter((it) => it.userDetails.alreadyWatched);
        break;
      case FilterName.FAVORITES:
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
      case watchedCount === UserRating.NOTHING:
        this._userTitle = ``;
        break;
      case watchedCount <= UserRating.NOVICE:
        this._userTitle = `novice`;
        break;
      case watchedCount <= UserRating.FAN:
        this._userTitle = `fan`;
        break;
      case watchedCount > UserRating.MOVIE_BUFF:
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
        this._cards = this._getFilteredCards(this._cards, this._filterMode);
        this._boardController.showCards(this._cards);

      });
  }
}

