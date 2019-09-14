import {AbstractComponent} from "./abstract-component.js";

export default class MostCommented extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>
        <div class="films-list__container"></div>
    </section>
    `.trim();
  }
}
