import {Position, Color, Keycode} from "../const";
import {render, unrender} from "../utils";
import Card from "../components/film-card";
import Popup from "../components/popup";

export default class MovieController {
  constructor(container, data, onDataChange, api) {
    this._container = container;
    this._bodyContainer = document.querySelector(`body`);
    this._data = data;
    this._onDataChange = onDataChange;
    this._api = api;
    this._card = new Card(data);
    this._popup = null;
    this.init();
  }

  init() {
    render(this._container, this._card.getElement(), Position.BEFOREEND);

    this._card.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, () => {
      this._api.getComments(this._data.id).then((comments) => this._renderPopup(comments));
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

  _renderPopup(comments) {
    this._popup = new Popup(this._data, comments);

    const watchLinkPopup = this._popup.getElement().querySelector(`#watchlist`);
    const watchedLinkPopup = this._popup.getElement().querySelector(`#watched`);
    const favoriteLinkPopup = this._popup.getElement().querySelector(`#favorite`);
    const ratingInputElements = this._popup.getElement().querySelectorAll(`.film-details__user-rating-input`);
    const ratingLabelElements = this._popup.getElement().querySelectorAll(`.film-details__user-rating-label`);
    const userRateElement = this._popup.getElement().querySelector(`.film-details__user-rating`);
    const commentInput = this._popup.getElement().querySelector(`.film-details__comment-input`);
    const emojiList = this._popup.getElement().querySelectorAll(`.film-details__emoji-item`);

    const blockRatingInputs = () => {
      for (const input of ratingInputElements) {
        input.disabled = true;
      }
    };

    const unMarkRatingLabels = () => {
      for (const label of ratingLabelElements) {
        label.style.backgroundColor = Color.DEFAULT;
      }
    };

    const unblockRatingInputs = () => {
      for (const input of ratingInputElements) {
        input.disabled = false;
      }
    };

    const blockCommentInput = () => {
      commentInput.disabled = true;
      for (const emoji of emojiList) {
        emoji.disabled = true;
      }
    };

    const unblockCommentInput = () => {
      commentInput.disabled = false;
      for (const emoji of emojiList) {
        emoji.disabled = false;
      }
    };

    render(this._bodyContainer, this._popup.getElement(), Position.BEFOREEND);

    this._popup.getElement()
        .querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, this._unrenderPopup.bind(this));

    watchLinkPopup.addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        evt.preventDefault();
        this._data.userDetails.watchlist = !this._data.userDetails.watchlist;
        this._onDataChange(this._data);
      }
    });

    watchedLinkPopup.addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        evt.preventDefault();
        this._data.userDetails.alreadyWatched = !this._data.userDetails.alreadyWatched;

        if (!this._data.userDetails.alreadyWatched) {
          onResetRating(evt);
        } else {
          this._popup.getElement().querySelector(`.form-details__middle-container `).classList.remove(`visually-hidden`);
        }

        this._onDataChange(this._data);
      }
    });

    favoriteLinkPopup.addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        evt.preventDefault();
        this._data.userDetails.favorite = !this._data.userDetails.favorite;
        this._onDataChange(this._data);
      }
    });

    for (const input of ratingInputElements) {
      input.addEventListener(`change`, (evt) => {
        evt.preventDefault();
        const selectedLabel = this._popup.getElement().querySelector(`label[for="${evt.target.id}"]`);

        blockRatingInputs();
        unMarkRatingLabels();
        this._data.userDetails.personalRating = parseInt(evt.target.value, 10);

        this._api.updateCard({
          id: this._data.id,
          data: this._data.toRAW(),
        })
        .then(() => {
          this._onDataChange(this._data);
          unblockRatingInputs();
          selectedLabel.style.backgroundColor = Color.SELECTED;
        })
        .catch(() => {
          selectedLabel.style.backgroundColor = Color.ERROR;
          selectedLabel.style.animation = `shake 0.6s`;
          unblockRatingInputs();
        });
      });
    }

    const onResetRating = (evt) => {
      evt.preventDefault();
      if (this._data.userDetails.personalRating) {
        this._data.userDetails.personalRating = 0;
        this._api.updateCard({
          id: this._data.id,
          data: this._data.toRAW(),
        })
          .then(() => this._onDataChange(this._data));

        this._popup.getElement().querySelector(`.form-details__middle-container`).classList.add(`visually-hidden`);

        if (userRateElement) {
          userRateElement.remove();
        }
        unMarkRatingLabels();
      }
    };

    this._popup.getElement().querySelector(`.film-details__watched-reset`)
    .addEventListener(`click`, onResetRating);

    this._popup.getElement().querySelector(`.film-details__comments-wrap`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (evt.target.tagName !== `BUTTON`) {
          return;
        }

        const commentId = evt.target.getAttribute(`data-comment`);
        evt.target.disabled = true;

        this._api.deleteComment(commentId)
          .then(() => {
            this._popup.getElement().querySelector(`[data-item="${commentId}"]`).remove();
            this._popup.updateCommentsCount(this._popup.getElement().querySelectorAll(`.film-details__comment`).length);
            this._onDataChange(this._data);
          })
          .catch(() => {
            this._popup.getElement().querySelector(`[data-item="${commentId}"]`).style.animation = `shake 0.6s`;
            evt.target.disabled = false;
          });
      });

    this._popup.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {

      if (evt.target.tagName === `IMG`) {
        this._popup.getElement().querySelector(`.film-details__add-emoji-label img`).src = evt.target.src;
      }
    });

    commentInput.addEventListener(`keydown`, (evt) => {

      if (evt.keyCode === Keycode.ENTER && evt.ctrlKey && commentInput.value) {

        blockCommentInput();
        let newComment = {
          'comment': commentInput.value,
          'emotion': this._popup.getElement().querySelector(`input[name="comment-emoji"]:checked`).value,
          'date': new Date().toISOString(),
        };


        this._api.createComment(this._data.id, newComment)
        .then((response) => {

          newComment = response.comments[response.comments.length - 1];

          this._popup.addComment(newComment);

          this._popup.updateCommentsCount(this._popup.getElement().querySelectorAll(`.film-details__comment`).length);
          this._onDataChange(this._data);
          unblockCommentInput();

          let checkedInput = this._popup.getElement().querySelector(`INPUT[name="comment-emoji"]:checked`);
          // emojiContainer.innerHTML = ``;
          commentInput.value = ``;
          commentInput.style.border = `none`;
          checkedInput.checked = false;
        })
        .catch(() => {
          commentInput.style.animation = `shake 0.6s`;
          commentInput.style.border = `2px solid red`;
          unblockCommentInput();
        });
      }

    });

  }
}
