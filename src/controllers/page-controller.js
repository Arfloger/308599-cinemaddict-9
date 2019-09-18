import {Position} from "../const";
import {render, unrender} from "../utils";
import MovieController from "./movie-controller";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsList from "../components/films-list";
import FilmsListContainer from "../components/films-list-container";
import ShowMore from "../components/show-more";
import Message from "../components/message";

export default class PageController {
  constructor(container, cards, commentsData) {
    this._MAX_CARD_TO_SHOW = 5;
    this._MAX_CARD_TO_SHOW_EXTRA = 2;
    this._tasksOnPage = 0;
    this._leftCardsToRender = 0;
    this._container = container;
    this._cards = cards;
    this._sort = new Sort();
    this._films = new Films();
    this._filmsList = new FilmsList();
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
    this._topRatedContainer = new FilmsListContainer(`Top rated`, true);
    this._mostCommentedContainer = new FilmsListContainer(`Most commented`, true);
    this._showMore = new ShowMore();
    this._commentsData = commentsData;
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._topRatedContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._mostCommentedContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    this._leftCardsToRender = this._cards.length - this._tasksOnPage;
    this._renderShowMore();
    this._showCards(this._cards);
    this._renderTopRatedCards();
    // this._renderMostCommentedCards(this._cards, this._MAX_CARD_TO_SHOW_EXTRA);

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderCard(cardContainer, card) {
    const movieController = new MovieController(cardContainer, card, this._commentsData, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _showCards(cards) {
    if (cards.length === 0) {
      this._renderMessage();
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
      return;
    } else if (cards.length <= this._MAX_CARD_TO_SHOW) {
      cards.slice(0).map((card) => this._renderCard(this._mainFilmsContainer.getElement().querySelector(`.films-list__container`), card))
      .join(``);
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
      return;
    }

    cards.slice(this._tasksOnPage, this._tasksOnPage + this._MAX_CARD_TO_SHOW)
        .map((card) => this._renderCard(this._mainFilmsContainer.getElement().querySelector(`.films-list__container`), card))
        .join(``);

    this._tasksOnPage += this._MAX_CARD_TO_SHOW;
    this._leftCardsToRender = cards.length - this._tasksOnPage;

    if (this._leftCardsToRender <= 0) {
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
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
    this._mainFilmsContainer.getElement().querySelector(`.films-list__container`).innerHTML = ``;
    this._renderShowMore();
    this._tasksOnPage = 0;
    this._leftCardsToRender = 0;

    switch (evt.target.dataset.sortType) {
      case `date-down`:
        this._cards.sort((a, b) => b.releaseDate - a.releaseDate);
        this._showCards(this._cards);
        break;
      case `rating-down`:
        this._cards.sort((a, b) => b.rating - a.rating);
        this._showCards(this._cards);
        break;
      case `default`:
        this._cards.sort((a, b) => a.filmId - b.filmId);
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

  _renderTopRatedCards() {
    const ratingDownCards = this._cards.slice().sort((a, b) => b.rating - a.rating).slice(0, this._MAX_CARD_TO_SHOW_EXTRA);
    ratingDownCards.forEach((it) => {
      this._renderCard(this._topRatedContainer.getElement().querySelector(`.films-list__container`), it);
    });
  }

  // _renderMostCommentedCards(cards, countCards) {
  //   const commentQuantity = cards.sort((a, b) => b.rating - a.rating).slice(0, countCards);
  //   commentQuantity.forEach((it) => {
  //     this._renderCard(this._mostCommentedContainer.getElement().querySelector(`.films-list__container`), it);
  //   });
  // }

  _renderCardsAgain(cardsArr) {
    unrender(this._mainFilmsContainer.getElement());
    this._mainFilmsContainer.removeElement();
    unrender(this._showMore.getElement());
    this._showMore.removeElement();
    render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
    this._leftCardsToRender = 0;
    this._tasksOnPage = 0;
    this._renderShowMore();
    this._showCards(cardsArr);
  }

  _onDataChange(newData, oldData) {
    this._cards[this._cards.findIndex((it) => it === oldData)] = newData;
    this._renderCardsAgain(this._cards);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

}
