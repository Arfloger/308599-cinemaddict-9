import {Keycode, Position} from "../const.js";
import {unrender, render} from "../utils.js";
import Card from "./film-card.js";
import Popup from "./popup.js";

export default class MovieController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._card = new Card(data);
    this._popup = new Popup(data);
    this.init();
  }

  init() {

    const onRenderPopupClick = () => {
      render(this._container.getElement(), this._popup.getElement(), Position.BEFOREEND);
    };

    const onUnrenderPopupClick = () => {
      unrender(this._popup.getElement());
      const entry = this.setNewDataPopup();
      this._onDataChange(entry, this._data);
    };

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === Keycode.ESC) {
        this._popup.getElement();
        unrender(this._popup.getElement());
        const entry = this.setNewDataPopup();
        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._card.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
      onRenderPopupClick();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onUnrenderPopupClick);

    this._popup.getElement().querySelector(`.film-details__comment-input`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._popup.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container.getElement(), this._card.getElement(), Position.BEFOREEND);


    this._card
      .getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._card
      .getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`).classList.toggle(`film-card__controls-item--active`);

        const entry = this.setNewDataCard();
        this._onDataChange(entry, this._data);

      });

    this._card
      .getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._card
      .getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`).classList.toggle(`film-card__controls-item--active`);

        const entry = this.setNewDataCard();
        this._onDataChange(entry, this._data);

      });

    this._card
      .getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._card
      .getElement()
      .querySelector(`.film-card__controls-item--favorite`).classList.toggle(`film-card__controls-item--active`);

        const entry = this.setNewDataCard();
        this._onDataChange(entry, this._data);

      });

    this._popup
      .getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const inputElement = this._popup.getElement().querySelector(`#watchlist`);

        if (inputElement.hasAttribute(`checked`)) {
          inputElement.removeAttribute(`checked`);
        } else {
          inputElement.setAttribute(`checked`, `checked`);
        }

        document.addEventListener(`keydown`, onEscKeyDown);

      });

    this._popup
      .getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const inputElement = this._popup.getElement().querySelector(`#watched`);

        if (inputElement.hasAttribute(`checked`)) {
          inputElement.removeAttribute(`checked`);
          this._popup.getElement().querySelector(`.form-details__middle-container`).classList.add(`visually-hidden`);
        } else {
          inputElement.setAttribute(`checked`, `checked`);
          this._popup.getElement().querySelector(`.form-details__middle-container`).classList.remove(`visually-hidden`);
        }

        document.addEventListener(`keydown`, onEscKeyDown);

      });

    this._popup
      .getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const inputElement = this._popup.getElement().querySelector(`#favorite`);

        if (inputElement.hasAttribute(`checked`)) {
          inputElement.removeAttribute(`checked`);
        } else {
          inputElement.setAttribute(`checked`, `checked`);
        }

        document.addEventListener(`keydown`, onEscKeyDown);

      });

    this._popup.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, () => {
      this._popup.getElement().querySelector(`.film-details__comment-delete`).closest(`.film-details__comment`).remove();
    });

    this._popup.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `IMG`) {
        this._popup.getElement().querySelector(`.film-details__add-emoji-label img`).src = evt.target.src;
      }
    });


  }

  setNewDataCard() {
    const entry = {
      title: this._card._title,
      poster: this._card._poster,
      description: this._card._description,
      genre: this._card._genre,
      year: this._card._year,
      rating: this._card._rating,
      duration: this._card._duration,
      isToWatchlist: this._card.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).classList.contains(`film-card__controls-item--active`) ? true : false,
      wasWatched: this._card.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).classList.contains(`film-card__controls-item--active`) ? true : false,
      isFavorite: this._card.getElement().querySelector(`.film-card__controls-item--favorite`).classList.contains(`film-card__controls-item--active`) ? true : false,
    };

    return entry;
  }

  setNewDataPopup() {
    const entry = {
      title: this._card._title,
      poster: this._card._poster,
      description: this._card._description,
      genre: this._card._genre,
      year: this._card._year,
      rating: this._card._rating,
      duration: this._card._duration,
      isToWatchlist: this._popup.getElement().querySelector(`#watchlist`).hasAttribute(`checked`) ? true : false,
      wasWatched: this._popup.getElement().querySelector(`#watched`).hasAttribute(`checked`) ? true : false,
      isFavorite: this._popup.getElement().querySelector(`#favorite`).hasAttribute(`checked`) ? true : false,
    };

    return entry;
  }

  setDefaultView() {
    if (document.body.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }

}
