import {AbstractComponent} from "../components/abstract-component";

export default class Menu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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
