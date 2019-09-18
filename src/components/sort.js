import {AbstractComponent} from "../components/abstract-component";

export default class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <ul class="sort">
        <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" data-sort-type="date-down" class="sort__button">Sort by date</a></li>
        <li><a href="#" data-sort-type="rating-down" class="sort__button">Sort by rating</a></li>
    </ul>
    `.trim();
  }
}
