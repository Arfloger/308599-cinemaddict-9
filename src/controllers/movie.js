import {Position, Keycode} from "../const";
import {render, unrender} from "../utils";
import Card from "../components/film-card";
import Popup from "../components/popup";

export default class MovieController {
  constructor(container, data, onDataChange) {
    this._container = container;
    this._bodyContainer = document.querySelector(`body`);
    this._data = data;
    this._onDataChange = onDataChange;
    this._card = new Card(data);
    this._popup = null;
    this.init();
  }

  init() {

    render(this._container, this._card.getElement(), Position.BEFOREEND);

    this._card.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, () => {
      this._renderPopup();
    });

    this._card.getElement().querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onFilmControlsClick.bind(this));
  }

  _onFilmControlsClick(evt) {
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

  _unrenderPopup() {
    unrender(this._popup.getElement());
    this._popup.removeElement();
  }

  _renderPopup() {

    const onEscKeyDown = (evt) => {
      if (evt.KeyCode === Keycode.ESC) {
        this._unrenderPopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._popup = new Popup(this._data);

    render(this._bodyContainer, this._popup.getElement(), Position.BEFOREEND);
    document.addEventListener(`keydown`, (evt) => onEscKeyDown(evt));

    this._popup.getElement()
        .querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, this._unrenderPopup.bind(this));

        //test
  }
}
