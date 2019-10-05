import {Position} from "../const";
import {render} from "../utils";
import Card from "../components/film-card";

export default class MovieController {
  constructor(container, data, onDataChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._card = new Card(data);
    this.init();
  }

  init() {
    render(this._container, this._card.getElement(), Position.BEFOREEND);

    this._card.getElement().querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onFilmControlsClick.bind(this));
  }

  _onFilmControlsClick(evt) {
    // debugger
    evt.preventDefault();

    evt.target.classList.toggle(`film-card__controls-item--active`);

    this._data.userDetails.watchlist = this._card.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .classList.contains(`film-card__controls-item--active`);
    this._data.userDetails.alreadyWatched = this._card.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .classList.contains(`film-card__controls-item--active`);
    this._data.userDetails.favorite = this._card.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .classList.contains(`film-card__controls-item--active`);

    this._onDataChange(this._data);
  }
}
