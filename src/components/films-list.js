import {AbstractComponent} from "../components/abstract-component.js";

export default class FilmsList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
    `.trim();
  }
}
