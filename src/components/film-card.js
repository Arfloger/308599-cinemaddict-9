import {AbstractComponent} from "../components/abstract-component";
import moment from 'moment';
import 'moment-duration-format';

export default class Card extends AbstractComponent {
  constructor({title, rating, duration, genre, poster, description, isToWatchlist, wasWatched, isFavorite, releaseDate}) {
    super();
    this._title = title;
    this._rating = rating;
    this._duration = duration;
    this._genre = genre;
    this._poster = poster;
    this._description = description;
    this._isToWatchlist = isToWatchlist;
    this._wasWatched = wasWatched;
    this._isFavorite = isFavorite;
    this._releaseDate = releaseDate;
  }

  getTemplate() {
    return `
    <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
            <span class="film-card__year">${moment(this._releaseDate).format(`DD MMM YYYY`)}</span>
            <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h[h] m[m]`)}</span>
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
