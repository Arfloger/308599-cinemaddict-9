import {AbstractComponent} from "../components/abstract-component";
import {render} from "../utils";
import {Position} from "../const";
import moment from 'moment';
import 'moment-duration-format';

export default class Popup extends AbstractComponent {
  constructor({filmInfo, userDetails}, comments) {
    super();
    this._title = filmInfo.title;
    this._alternativeTitle = filmInfo.alternativeTitle;
    this._rating = filmInfo.totalRating;
    this._ageRating = filmInfo.ageRating;
    this._director = filmInfo.director;
    this._writers = filmInfo.writers;
    this._actors = filmInfo.actors;
    this._releaseCountry = filmInfo.release.releaseCountry;
    this._runtime = filmInfo.runtime;
    this._genre = filmInfo.genre;
    this._poster = filmInfo.poster;
    this._description = filmInfo.description;
    this._releaseDate = filmInfo.release.date;
    this._wasWatched = userDetails.alreadyWatched;
    this._isFavorite = userDetails.favorite;
    this._isToWatchlist = userDetails.watchlist;
    this._personalRating = userDetails.personalRating;
    this._comments = comments;
  }

  getRatingTemplate() {

    return `
    <div class="form-details__middle-container ${this._wasWatched ? `` : `visually-hidden`}">
    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="${this._poster}" alt="${this._title}" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
          
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${this._personalRating === 1 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-1">1</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${this._personalRating === 2 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-2">2</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${this._personalRating === 3 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-3">3</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${this._personalRating === 4 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-4">4</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${this._personalRating === 5 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-5">5</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${this._personalRating === 6 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-6">6</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${this._personalRating === 7 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-7">7</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${this._personalRating === 8 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-8">8</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${this._personalRating === 9 ? `checked` : ``}>
            <label class="film-details__user-rating-label" for="rating-9">9</label>

          </div>
        </section>
      </div>
    </section>
  </div>
    `.trim();
  }

  getTemplate() {
    return `
    <section class="film-details">
    <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
        <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
            <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

            <p class="film-details__age">${this._ageRating}+</p>
            </div>

            <div class="film-details__info">
            <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">${this._alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
                </div>
            </div>

            <table class="film-details__table">
                <tbody><tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._writers.map((it) => it).join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors.map((it) => it).join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${ moment.duration(this._runtime, `minutes`).format(`h[h] m[m]`)}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                <td class="film-details__term">Genr${this._genre.length > 1 ? `es` : `e` }</td>
                <td class="film-details__cell">
                    <span class="film-details__genre">${this._genre.map((it) => it).join(`, `)}</span>
                </td>
                </tr>
            </tbody></table>

            <p class="film-details__film-description">${this._description}</p>
            </div>
        </div>

        <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isToWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._wasWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
        </div>

        ${this.getRatingTemplate()}
        
        <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

            <ul class="film-details__comments-list">

          ${this._comments.map((it) => {

    return `<li class="film-details__comment" data-item="${it.id}">
                          <span class="film-details__comment-emoji">
                            <img src="./images/emoji/${it.emotion}.png" 
                            width="55" 
                            height="55" 
                            alt="${it.emotion} emoji">
                          </span>
                          <div>
                            <p class="film-details__comment-text">${it.comment}</p>
                            <p class="film-details__comment-info">
                              <span class="film-details__comment-author">${it.author}</span>
                              <span class="film-details__comment-day">${moment(it.date).format(`YY/MM/DD HH: MM`)}</span>
                              <button class="film-details__comment-delete" data-comment="${it.id}">Delete</button>
                            </p>
                          </div>
              </li>`.trim();
  }).join(``)}
         

            </ul>

            <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
                <img src="images/emoji/smile.png" width="55" height="55" alt="emoji">
            </div>

            <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" checked="">
                <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
            </div>
            </div>
        </section>
        </div>
    </form>
    </section>
    `.trim();
  }

  updateCommentsCount(count) {
    this.getElement().querySelector(`.film-details__comments-count`).innerText = count;
  }

  addComment(data) {
    const liElement = document.createElement(`li`);
    liElement.setAttribute(`data-item`, data.id);
    liElement.classList.add(`film-details__comment`);

    render(this.getElement().querySelector(`.film-details__comments-list`), liElement, Position.BEFOREEND);
    liElement.innerHTML = `<span class="film-details__comment-emoji">
    <img src="./images/emoji/${data.emotion}.png" 
    width="55" 
    height="55" 
    alt="${data.emotion} emoji">
  </span>
  <div>
    <p class="film-details__comment-text">${data.comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${data.author}</span>
      <span class="film-details__comment-day">${moment(data.date).format(`YY/MM/DD HH: MM`)}</span>
      <button class="film-details__comment-delete" data-comment="${data.id}">Delete</button>
    </p>
  </div>`;
  }
}
