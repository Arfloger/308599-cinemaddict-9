import {createElement} from "../utils.js";

export default class Profile {
  constructor(watchedCount) {
    this._element = null;
    this._watchedCount = watchedCount;
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
    <section class="header__profile profile">
    <p class="profile__rating">${this._watchedCount}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
    `.trim();
  }
}
