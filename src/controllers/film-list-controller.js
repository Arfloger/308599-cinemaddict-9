import moment from 'moment';
import {Position} from "../const";
import {render, unrender} from "../utils";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsList from "../components/films-list";
import FilmsListContainer from "../components/films-list-container";
import Message from "../components/message";
import MovieController from "./movie-controller";

export default class FilmListController {
  constructor(container) {
    // this._MAX_CARD_TO_SHOW = 5;
    // this._filmsOnPage = 0;
    // this._leftCardsToRender = 0;
    this._container = container;
    this._cards = [];
    this._sort = new Sort();
    this._message = new Message();
    this._subscriptions = [];
    this._onCommentsChangeMain = ``;
    // this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._films = new Films();
    this._filmsList = new FilmsList();
    this._mainFilmsContainer = new FilmsListContainer(`All movies. Upcoming`, false);
    this._topRatedContainer = new FilmsListContainer(`Top rated`, true);
    this._mostCommentedContainer = new FilmsListContainer(`Most commented`, true);
  }

  showCards(cards) {
    this._cards = cards;
    this._renderContainer();

    if (cards.length === 0) {
      this._renderMessage();
      return;
    }

    cards.forEach((card) => this._renderCard(card, this._mainFilmsContainer.getElement().querySelector(`.films-list__container`)));
  }

  _renderCard(card, cardContainer) {
    const movieController = new MovieController(cardContainer, card, this._onCommentsChange, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _renderContainer() {
    render(this._container, this._films.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
    render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._topRatedContainer.getElement(), Position.BEFOREEND);
    render(this._films.getElement(), this._mostCommentedContainer.getElement(), Position.BEFOREEND);

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _unrenderContainer() {
    unrender(this._films.getElement());
    this._films.removeElement();
  }

  _updateCards(cards) {
    this._unrenderContainer();
    this.showCards(cards);
  }

  _renderMessage() {
    render(this._mainFilmsContainer.getElement().querySelector(`.films-list__container`), this._message.getElement(), Position.AFTERBEGIN);
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
        this._cards = this._cards.sort((a, b) => moment(b.filmInfo.release.date) - moment(a.filmInfo.release.date));
        break;
      case `rating-down`:
        this._cards = this._cards.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      case `default`:
        this._cards = this._cards.sort((a, b) => a.id - b.id);
        break;
    }

    this._updateCards(this._cards);

  }

  _onDataChange(newData, oldData) {   
    this._cards[this._cards.findIndex((it) => it === oldData)] = newData;
    this._updateCards(this._cards);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

}
