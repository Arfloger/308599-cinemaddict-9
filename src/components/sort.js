import {AbstractComponent} from "../components/abstract-component.js";

export default class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <ul class="sort">
        <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" class="sort__button">Sort by date</a></li>
        <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>
    `.trim();
  }
}
