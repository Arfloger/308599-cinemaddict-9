import {AbstractComponent} from "../components/abstract-component.js";

export default class Films extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <section class="films"></section>
    `.trim();
  }
}
