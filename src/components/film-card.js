import {AbstractComponent} from "../components/abstract-component";
import moment from 'moment';
import 'moment-duration-format';

export default class Card extends AbstractComponent {
  constructor({comments, filmInfo, userDetails}) {
    super();
    this._comments = comments;
    this._title = filmInfo.title;
    this._rating = filmInfo.totalRating;
    this._duration = filmInfo.runtime;
    this._genre = filmInfo.genre;
    this._poster = filmInfo.poster;
    this._description = filmInfo.description;
    this._isToWatchlist = userDetails.watchlist;
    this._wasWatched = userDetails.alreadyWatched;
    this._isFavorite = userDetails.favorite;
    this._releaseDate = filmInfo.release.date;
  }

  getTemplate() {
    return `
    <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
            <span class="film-card__year">${moment(this._releaseDate).format(`DD MMM YYYY`)}</span>
            <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h[h] m[m]`)}</span>
            <span class="film-card__genre">${this._genre.map((it) => it).join(`, `)}</span>
        </p>
        <img src="${this._poster}" alt="${this._title}" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <a class="film-card__comments">${this._comments.length} comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isToWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._wasWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
    </article>
    `.trim();
  }
}
