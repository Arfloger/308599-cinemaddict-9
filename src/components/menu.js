import {createElement} from "../utils.js";

export default class Menu {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${this._filters.map((filter) => `<a href="#${filter.title}" class="main-navigation__item">${filter.title} 
      <span class="main-navigation__item-count">${filter.count}</span></a>`).join(``)}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>
    `.trim();
  }
}
