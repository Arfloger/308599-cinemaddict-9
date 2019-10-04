import MovieController from "../controllers/movie";

export default class filmListController {
  constructor(container) {
    this._container = container;
    this._cards = [];
  }

  renderCards(cards) {
    cards.forEach((card) => this._renderCard(this._container, card));
  }

  _renderCard(container, card) {
    const movieController = new MovieController(container, card);
  }
}

