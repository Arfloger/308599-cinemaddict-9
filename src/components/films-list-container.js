import {AbstractComponent} from "../components/abstract-component.js";

export default class FilmsListContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <div class="films-list__container"></div>
    `.trim();
  }
}
