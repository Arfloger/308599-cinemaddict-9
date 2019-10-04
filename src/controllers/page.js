import {AUTHORIZATION, END_POINT, Position, Mode} from "../const";
import {render} from "../utils";

import API from "../api/api";
import StatisticController from "../controllers/statistic";
import BoardController from "../controllers/board";
import SearchController from "../controllers/search";

import Filter from "../components/filter";
import Search from "../components/search";

export default class PageController {
  constructor() {
    this._container = document.querySelector(`.main`);
    this._cards = [];
    this._filter = null;
    this._filterMode = `#all`;

    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._statisticController = new StatisticController(this._container);
    this._boardController = new BoardController(this._container, Mode.DEFAULT);
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

            // как вынести в контроллер и не потерять логику показа окон? (методы show/ hide у контроллеров статистики и борда)
            this._renderFilter(this._cards);

            // обработчик поиска прятать/ скрывать в функцию ?
            this._search.getElement().querySelector(`input`).addEventListener(`keyup`, (evt) => {
              if (evt.target.value.length >= 3) {
                this._searchController.show();
                this._statisticController.hide();
                this._boardController.hide();
              } else {
                this._boardController.show();
                this._searchController.hide();
                this._statisticController.hide();
              }
            });

            this._search.getElement().querySelector(`.search__reset`).addEventListener(`click`, () => {
              this._boardController.show();
              this._searchController.hide();
              this._statisticController.hide();
            });

          });
  }

  _setFooterStatistics(cards) {
    const footerStatisticElement = document.querySelector(`.footer__statistics p`);
    footerStatisticElement.textContent = `${cards.length} movies inside`;
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

      const currentNavElement = evt.target.href.slice(evt.target.href.indexOf(`#`));

      switch (currentNavElement) {
        case `#stats`:
          this._statisticController.show(this._cards);
          this._searchController.hide();
          this._boardController.hide();
          break;
        case `#all`:
          this._filterMode = `#all`;
          this._statisticController.hide();
          this._searchController.hide();
          this._boardController.show();
          // При множественном нажатии падают карточки, добавить активное состояние везде
          // this._boardController.showCards(this._cards);
          break;
        case `#Watchlist`:
          this._filterMode = `#Watchlist`;
          this._statisticController.hide();
          this._searchController.hide();
          this._boardController.show();
          // this._boardController.showCards(this._cards);
          break;
        case `#History`:
          this._filterMode = `#History`;
          this._statisticController.hide();
          this._searchController.hide();
          this._boardController.show();
          // this._boardController.filterCards(this._cards, `#History`);
          break;
        case `#Favorites`:
          this._filterMode = `#Favorites`;
          this._statisticController.hide();
          this._searchController.hide();
          this._boardController.show();
          // this._boardController.filterCards(this._cards, `#Favorites`);
          break;
      }

    });
  }
}

