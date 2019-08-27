import {createElement} from "../utils.js";

export default class ExtraCard {
  constructor(title) {
    this._element = null;
    this._title = title;
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
    <section class="films-list--extra">
        <h2 class="films-list__title">${this._title}</h2>
        <div class="films-list__container"></div>
    </section>
    `.trim();
  }
}
