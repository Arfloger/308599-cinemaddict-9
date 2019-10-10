import moment from 'moment';
import {unrender, render} from "../utils";
import {Position} from "../const";
import Films from "../components/films";
import FilmsListContainer from "../components/films-list-container";
import Message from "../components/message";
import ShowMore from "../components/show-more";
import Sort from "../components/sort";
import FilmsListController from "../controllers/film-list";

export default class BoardController {
  constructor(container, mode, onDataChange, api) {
    this._MAX_CARD_TO_SHOW = 5;
    this._cardsOnPage = false;
    this._leftCardsToRender = 0;
    this._container = container;
    this._mode = mode;
    this._api = api;
    this._onDataChangeMain = onDataChange;
    this._cards = null;
    this._sortCards = null;
    this._films = new Films();
    this._sort = new Sort();
    this._onDataChange = this._onDataChange.bind(this);
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
    this._topRated = new FilmsListContainer(`Top Rated`, true);
    this._mostCommented = new FilmsListContainer(`Most Commented`, true);
    this._filmListController = new FilmsListController(this._mainFilmsContainer.getElement().querySelector(`.films-list__container`), this._onDataChange, this._api);
    this._filmListRatingController = new FilmsListController(this._topRated.getElement().querySelector(`.films-list__container`), this._onDataChange, this._api);
    this._filmListCommentController = new FilmsListController(this._mostCommented.getElement().querySelector(`.films-list__container`), this._onDataChange, this._api);
    this._message = new Message();
    this._showMore = new ShowMore();
    this.init();
  }

  init() {
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);

    if (this._mode === `default`) {
      render(this._films.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
      this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

      this._showMore.getElement().addEventListener(`click`, () => {

        if (this._cardsOnPage < this._cards.length) {
          this._cardsOnPage += this._MAX_CARD_TO_SHOW;
          this._leftCardsToRender = this._sortCards.length - this._cardsOnPage;
        }

        this.showCards(this._cards);
      });
    }
  }

  showCards(cards) {
    this._cards = cards;

    this._sortCards = this._cards.slice();

    this.unrender();
    render(this._mainFilmsContainer.getElement(), this._showMore.getElement(), Position.BEFOREEND);

    if (this._mode === `search`) {
      this._filmListController.renderCards(this._sortCards);
      this._unrenderShowMore();
      if (this._cards.length === 0) {
        render(this._container, this._message.getElement(), Position.BEFOREEND);
      } else {
        unrender(this._message.getElement());
        this._message.getElement().remove();
      }
      return;
    }

    if (this._sortCards.length !== 0) {
      unrender(this._message.getElement());
      this._message.getElement().remove();
    }

    if (this._sortCards.length === 0) {
      render(this._container, this._message.getElement(), Position.BEFOREEND);
      this._unrenderShowMore();
      this._setTopRated();
      this._setMostCommented();
      return;
    } else if (this._sortCards.length <= this._MAX_CARD_TO_SHOW) {
      this._filmListController.renderCards(this._sortCards);
      this._unrenderShowMore();
      this._setTopRated();
      this._setMostCommented();
      return;
    }

    if (this._cardsOnPage === false) {
      this._cardsOnPage += this._MAX_CARD_TO_SHOW;
      this._leftCardsToRender = this._sortCards.length - this._cardsOnPage;
    }

    const cardsToRender = this._sortCards.slice(0, this._cardsOnPage);
    this._filmListController.renderCards(cardsToRender);

    this._renderShowMore();
    this._setTopRated();
    this._setMostCommented();

    if (this._leftCardsToRender <= 0) {
      this._unrenderShowMore();
    }

  }

  show() {
    this._films.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._films.getElement().classList.add(`visually-hidden`);
  }

  unrender() {
    this._mainFilmsContainer.getElement().querySelector(`.films-list__container`).innerHTML = ``;
  }

  _onDataChange(newData) {
    this._onDataChangeMain(newData);
  }

  _renderShowMore() {
    this._showMore.getElement().classList.remove(`visually-hidden`);
  }

  _unrenderShowMore() {
    this._showMore.getElement().classList.add(`visually-hidden`);
  }

  _onSortLinkClick(evt) {

    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    if (evt.target.classList.contains(`sort__button--active`)) {
      return;
    }

    this._sort.getElement().querySelectorAll(`.sort__button`)
      .forEach((item) => item.classList.remove(`sort__button--active`));

    evt.target.classList.add(`sort__button--active`);

    let sortCards;

    switch (evt.target.dataset.sortType) {
      case `date-down`:
        sortCards = this._sortCards.sort((a, b) => moment(b.filmInfo.release.date) - moment(a.filmInfo.release.date));
        break;
      case `rating-down`:
        sortCards = this._sortCards.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      case `default`:
        sortCards = this._cards.sort((a, b) => a.id - b.id);
        break;
    }

    this.showCards(sortCards);

  }

  _renderTopRated() {
    this._topRated.getElement().classList.remove(`visually-hidden`);
    this._topRated.getElement().querySelector(`.films-list__container`).innerHTML = ``;
    let sortRatedCards = this._cards.slice();
    render(this._films.getElement(), this._topRated.getElement(), Position.BEFOREEND);

    sortRatedCards.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

    this._filmListRatingController.renderCards(sortRatedCards.slice(0, 2));
  }

  _unrenderTopRated() {
    this._topRated.getElement().classList.add(`visually-hidden`);
  }

  _renderMostCommented() {
    this._mostCommented.getElement().classList.remove(`visually-hidden`);
    this._mostCommented.getElement().querySelector(`.films-list__container`).innerHTML = ``;
    let sortRatedCards = this._cards.slice();
    render(this._films.getElement(), this._mostCommented.getElement(), Position.BEFOREEND);

    sortRatedCards.sort((a, b) => b.comments.length - a.comments.length);

    this._filmListCommentController.renderCards(sortRatedCards.slice(0, 2));
  }

  _unrenderMostCommented() {
    this._mostCommented.getElement().classList.add(`visually-hidden`);
  }

  _setTopRated() {
    if (this._mode === `default` && this._cards.length > 2) {
      this._renderTopRated();
    } else {
      this._unrenderTopRated();
    }
  }

  _setMostCommented() {
    if (this._mode === `default`) {
      let sortRatedCards = this._cards.slice();
      sortRatedCards.filter((it) => it.comments.length > 0);

      if (sortRatedCards.length > 2) {
        this._renderMostCommented();
      } else {
        this._unrenderMostCommented();
      }
    }
  }

}
