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
  constructor(container, mode, onDataChange) {
    this._MAX_CARD_TO_SHOW = 5;
    this._cardsOnPage = false;
    this._leftCardsToRender = 0;
    this._container = container;
    this._mode = mode;
    this._onDataChangeMain = onDataChange;
    this._cards = null;
    this._sortCards = null;
    this._films = new Films();
    this._sort = new Sort();
    this._onDataChange = this._onDataChange.bind(this);
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
    this._filmListController = new FilmsListController(this._mainFilmsContainer.getElement().querySelector(`.films-list__container`), this._onDataChange);
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
      this._renderShowMore();
    }
  }

  showCards(cards) {
    this._cards = cards;
    this._sortCards = Object.assign([], this._cards);

    if (this._mode === `search`) {
      this._filmListController.renderCards(this._sortCards);
      return;
    }

    if (this._sortCards.length === 0) {
      render(this._container, this._message.getElement(), Position.BEFOREEND);
      return;
    } else if (this._sortCards.length <= this._MAX_CARD_TO_SHOW) {
      this._filmListController.renderCards(this._sortCards);
      return;
    }

    this.unrender();

    if (this._cardsOnPage === false) {
      this._cardsOnPage += this._MAX_CARD_TO_SHOW;
      this._leftCardsToRender = this._sortCards.length - this._cardsOnPage;
    }

    const cardsToRender = this._sortCards.slice(0, this._cardsOnPage);
    this._filmListController.renderCards(cardsToRender);

    if (this._leftCardsToRender <= 0) {
      this._unrenderShowMore();
    }

    console.log(`осталось ${this._leftCardsToRender}`);
    console.log(`На странице ${this._cardsOnPage}`);
    

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
    render(this._mainFilmsContainer.getElement(), this._showMore.getElement(), Position.BEFOREEND);

    this._showMore.getElement().addEventListener(`click`, () => {

      if (this._cardsOnPage < this._cards.length) {
        this._cardsOnPage += this._MAX_CARD_TO_SHOW;
        this._leftCardsToRender = this._sortCards.length - this._cardsOnPage;
      }

      this.showCards(this._cards);
    });
  }

  _unrenderShowMore() {
    unrender(this._showMore.getElement());
    this._showMore.removeElement();
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

}

