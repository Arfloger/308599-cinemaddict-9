import {Position} from "../const";
import {render} from "../utils";
import Message from "../components/message";
import MovieController from "./movie-controller";

export default class FilmListController {
  constructor(container, cards) {
    this._MAX_CARD_TO_SHOW = 5;
    this._filmsOnPage = 0;
    this._leftCardsToRender = 0;
    this._container = container;
    this._cards = cards;
    this._message = new Message();
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    this._showCards(this._cards);
  }

  _renderCard(cardContainer, card) {
    const movieController = new MovieController(cardContainer, card, this._commentsData, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _showCards(cards) {
    if (cards.length === 0) {
      this._renderMessage();
      return;
    }

    cards.map((card) => this._renderCard(this._container.getElement().querySelector(`.films-list__container`), card))
        .join(``);

  }

  _renderMessage() {
    render(this._container.getElement().querySelector(`.films-list__container`), this._message.getElement(), Position.AFTERBEGIN);
  }

  _onDataChange(newData, oldData) {
    this._cards[this._cards.findIndex((it) => it === oldData)] = newData;
    this._renderCardsAgain(this._cards);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _renderCardsAgain(cardsArr) {
    this._container.getElement().querySelector(`.films-list__container`).innerHTML = ``;
    this._showCards(cardsArr);
  }
}
