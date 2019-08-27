import {createElement} from "../utils.js";

export default class Card {
  constructor({title, rating, year, duration, genre, poster, description, isToWatchlist, wasWatched, isFavorite}) {
    this._title = title;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genre = genre;
    this._poster = poster;
    this._description = description;
    this._isToWatchlist = isToWatchlist;
    this._wasWatched = wasWatched;
    this._isFavorite = isFavorite;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
    <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
            <span class="film-card__year">${this._year}</span>
            <span class="film-card__duration">${this._duration}</span>
            <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="./images/posters/${this._poster}" alt="${this._title}" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <a class="film-card__comments">5 comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isToWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._wasWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
    </article>
    `.trim();
  }
}
