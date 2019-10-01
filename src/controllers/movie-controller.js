import {Keycode, Position} from "../const";
import {unrender, render} from "../utils";
import Card from "../components/film-card";
import Popup from "../components/popup";

export default class MovieController {
  constructor(container, data, commentsData, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._commentsData = commentsData;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._card = new Card(data);
    this._popup = new Popup(data);
    this.init();
  }

  init() {
    render(this._container, this._card.getElement(), Position.BEFOREEND);
    const onRenderPopupClick = () => {
      render(document.body, this._popup.getElement(), Position.BEFOREEND);
    };

    const onUnrenderPopupClick = () => {
      const entry = this.setNewDataPopup();
      this._onDataChange(entry, this._data);
      unrender(this._popup.getElement());
      this._popup.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === Keycode.ESC) {
        const entry = this.setNewDataPopup();
        this._onDataChange(entry, this._data);
        unrender(this._popup.getElement());
        this._popup.removeElement();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._card.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, () => {
      onRenderPopupClick();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._card.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._card.getElement()
        .querySelector(`.film-card__controls-item--add-to-watchlist`).classList.toggle(`film-card__controls-item--active`);

 
        console.log(this._data);

        const entry = this.setNewDataCard();
        this._onDataChange(entry, this._data);
      });

    this._card.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._card.getElement()
        .querySelector(`.film-card__controls-item--mark-as-watched`).classList.toggle(`film-card__controls-item--active`);

        const entry = this.setNewDataCard();
        this._onDataChange(entry, this._data);
      });

    this._card.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._card.getElement()
        .querySelector(`.film-card__controls-item--favorite`).classList.toggle(`film-card__controls-item--active`);

        console.log(this._data);
        
        const entry = this.setNewDataCard();
        this._onDataChange(entry, this._data);
      });

    this._popup.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, onUnrenderPopupClick);

    this._popup.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._popup.getElement()
      .querySelector(`.film-details__comment-input`)
        .addEventListener(`blur`, () => {
          document.addEventListener(`keydown`, onEscKeyDown);
        });

    this._popup.getElement()
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

    this._popup.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.classList.contains(`film-details__comment-delete`)) {
        // this._oncommentChange(null, this._data) передать null, создать 2 функции и еще подписку, добавить еще параметры в контроллер, думаю, структура поменяется и придется переделывать, когда данные придут с сервера. Не буду пока это реализовывать;
      }

    });

    this._popup.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `IMG`) {
        this._popup.getElement().querySelector(`.film-details__add-emoji-label img`).src = evt.target.src;
      }
    });

  }

  setNewDataCard() {
    const entry = {
      id: this._card.id,
      comments: this._card.comments,
      filmInfo: {
        title: this._card.filmInfo.title,
        alternativeTitle: this._card.filmInfo.alternativeTitle,
        totalRating: this._card.filmInfo.totalRating,
        poster: this._card.filmInfo.poster,
        ageRating: this._card.filmInfo.ageRating,
        director: this._card.filmInfo.director,
        writers: this._card.filmInfo.writers,
        actors: this._card.filmInfo.actors,
        release: {
          date: this._card.filmInfo.release.date,
          releaseCountry: this._card.filmInfo.release.releaseCountry,
        },
        runtime: this._card.filmInfo.runtime,
        genre: this._card.filmInfo.genre,
        description: this._card.filmInfo.description,
      },
      userDetails: {
        personalRating: this._card.userDetails.personalRating,
        watchlist: this._card.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).classList.contains(`film-card__controls-item--active`) ? true : false,
        alreadyWatched: this._card.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).classList.contains(`film-card__controls-item--active`) ? true : false,
        favorite: this._card.getElement().querySelector(`.film-card__controls-item--favorite`).classList.contains(`film-card__controls-item--active`) ? true : false,
      },
    };


    return entry;
  }

  setNewDataPopup() {
    const entry = {
      title: this._card._title,
      poster: this._card._poster,
      description: this._card._description,
      genre: this._card._genre,
      rating: this._card._rating,
      duration: this._card._duration,
      isToWatchlist: this._popup.getElement().querySelector(`#watchlist`).hasAttribute(`checked`) ? true : false,
      wasWatched: this._popup.getElement().querySelector(`#watched`).hasAttribute(`checked`) ? true : false,
      isFavorite: this._popup.getElement().querySelector(`#favorite`).hasAttribute(`checked`) ? true : false,
      releaseDate: this._card._releaseDate,
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
