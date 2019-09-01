import {Position, Keycode} from "../const.js";
import {render, unrender} from "../utils.js";
import Sort from "./sort.js";
import Films from "./films.js";
import FilmsList from "./films-list.js";
import FilmsListContainer from "./films-list-container.js";
import Card from "./film-card.js";
import ExtraCard from "./extra.js";
import Popup from "./popup.js";
import ShowMore from "./show-more.js";
import Message from "./message.js";

export default class PageController {
  constructor(container, cards, extraCards) {
    this._MAX_CARD_TO_SHOW = 5;
    this._tasksOnPage = 0;
    this._leftCardsToRender = 0;
    this._container = container;
    this._cards = cards;
    this._extraCards = extraCards;
    this._sort = new Sort();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._filmsListContainer = new FilmsListContainer();
    this._showMore = new ShowMore();
  }

  init() {
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    this._leftCardsToRender = this._cards.length - this._tasksOnPage;
    this._renderShowMore();
    this._showCards(this._cards);
    this._renderExtraCard(`Top rated`);
    this._renderExtraCard(`Most commented`);
    this._sort.getElement()
    .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderCard(card, renderContainer) {
    const cardComponent = new Card(card);
    const popupComponent = new Popup(card);

    const onRenderPopupClick = () => {
      render(renderContainer, popupComponent.getElement(), Position.BEFOREEND);
    };

    const onUnrenderPopupClick = () => {
      unrender(popupComponent.getElement());
    };

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === Keycode.ESC) {
        popupComponent.getElement();
        unrender(popupComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    cardComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
      onRenderPopupClick();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    popupComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onUnrenderPopupClick);

    popupComponent.getElement().querySelector(`.film-details__comment-input`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    popupComponent.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    render(renderContainer, cardComponent.getElement(), Position.BEFOREEND);
  }

  _renderExtraCard(title) {
    const extraCardComponent = new ExtraCard(title);

    render(this._films.getElement(), extraCardComponent.getElement(), Position.BEFOREEND);
    this._extraCards.map((extraCard) => this._renderCard(extraCard, extraCardComponent.getElement().querySelector(`.films-list__container`)));
  }

  _showCards(cards) {
    if (cards.length === 0) {
      this._renderMessage();
      unrender(this._showMore.getElement());
      return;
    } else if (cards.length <= this._MAX_CARD_TO_SHOW) {
      cards.slice(0).map((card) => this._renderCard(card, this._filmsListContainer.getElement()))
      .join(``);
      unrender(this._showMore.getElement());
      return;
    }

    cards.slice(this._tasksOnPage, this._tasksOnPage + this._MAX_CARD_TO_SHOW)
        .map((card) => this._renderCard(card, this._filmsListContainer.getElement()))
        .join(``);

    this._tasksOnPage += this._MAX_CARD_TO_SHOW;
    this._leftCardsToRender = cards.length - this._tasksOnPage;

    if (this._leftCardsToRender <= 0) {
      unrender(this._showMore.getElement());
    }
  }

  _onSortLinkClick(evt) {

    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._sort.getElement().querySelectorAll(`.sort__button`)
    .forEach((item) => item.classList.remove(`sort__button--active`));
    evt.target.classList.add(`sort__button--active`);

    this._filmsListContainer.getElement().innerHTML = ``;
    this._renderShowMore();
    this._tasksOnPage = 0;
    this._leftCardsToRender = 0;

    switch (evt.target.dataset.sortType) {
      case `date-down`:
        const sortedByDateDownCards = this._cards.slice().sort((a, b) => b.year - a.year);
        this._showCards(sortedByDateDownCards);
        break;
      case `rating-down`:
        const sortedByRatingDownCards = this._cards.slice().sort((a, b) => b.rating - a.rating);
        this._showCards(sortedByRatingDownCards);
        break;
      case `default`:
        this._showCards(this._cards);
        break;
    }
  }

  _renderMessage() {
    const message = new Message();
    render(this._filmsList.getElement(), message.getElement(), Position.AFTERBEGIN);
  }

  _renderShowMore() {
    render(this._filmsList.getElement(), this._showMore.getElement(), Position.BEFOREEND);

    this._showMore.getElement().addEventListener(`click`, () => {
      this._showCards(this._cards);
    });
  }
}
