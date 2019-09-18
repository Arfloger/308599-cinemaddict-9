import {AbstractComponent} from "../components/abstract-component";

export default class FilmsListContainer extends AbstractComponent {
  constructor(title, isExtra) {
    super();
    this._title = title;
    this._isExtra = isExtra;
  }

  getTemplate() {
    return `
    <section class="films-list${this._isExtra ? `--extra` : ``}">
      <h2 class="films-list__title ${this._isExtra ? `` : `visually-hidden`}">${this._title}</h2>
      <div class="films-list__container">
      </div>
    </section>
    `.trim();
  }
}
