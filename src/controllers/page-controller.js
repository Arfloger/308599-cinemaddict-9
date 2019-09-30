import {render} from "../utils";
import {Position, AUTHORIZATION, END_POINT} from "../const";

import SearchController from "./search-controller";
import FilmListController from "./film-list-controller";

import API from "../api/api";
import Search from "../components/search";
import MenuController from "../controllers/menu-controller";
import ProfileController from "../controllers/profile-controller";
import StatisticController from "../controllers/statistic-controller";

export default class PageController {
  constructor(container) {
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._headerElement = document.querySelector(`.header`);
    this._container = container;
    this._cards = [];
    this._search = new Search();
    this._searchController = new SearchController(this._container, this._search, this._cards);
    this._menuController = new MenuController(this._container, this._mainFilmsContainer);
    this._filmListController = new FilmListController(this._container);
    this._ProfileController = new ProfileController();
    this._statisticController = new StatisticController(this._container);
  }

  init() {
    render(this._headerElement, this._search.getElement(), Position.BEFOREEND);
    this._searchController.init();

    this._api.getCards()
      .then((cards) => {
        this._cards = cards;
        this._ProfileController.init(this._cards);
        this._menuController.init(this._cards);
        this._filmListController.showCards(this._cards);
        // this._statisticController.show(this._cards);
        this._setFooterStatistics(this._cards);
      });

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

  // hide() {
  //   this._films.getElement().classList.add(`visually-hidden`);
  // }

  // show() {
  //   this._films.getElement().classList.remove(`visually-hidden`);
  // }

  _setFooterStatistics(cards) {
    const footerStatisticElement = document.querySelector(`.footer__statistics p`);
    footerStatisticElement.textContent = `${cards.length} movies inside`;
  }

}
