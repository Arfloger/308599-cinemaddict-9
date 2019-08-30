import {AbstractComponent} from "../components/abstract-component.js";

export default class ShowMore extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <button class="films-list__show-more">Show more</button>
    `.trim();
  }
}
