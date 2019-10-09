import MovieController from "../controllers/movie";

export default class filmListController {
  constructor(container, onDataChange, api) {
    this._container = container;
    this._api = api;
    this._cards = [];
    this._onDataChangeMain = onDataChange;
    this._onDataChange = this._onDataChange.bind(this);
    this._movieController = null;
  }

  renderCards(cards) {
    cards.forEach((card) => this._renderCard(this._container, card));
  }

  _renderCard(container, card) {
    this._movieController = new MovieController(container, card, this._onDataChange, this._api);
  }

  _onDataChange(newData) {
    this._onDataChangeMain(newData);
  }
}

