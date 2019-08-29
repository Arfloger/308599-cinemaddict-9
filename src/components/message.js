import {AbstractComponent} from "../components/abstract-component.js";

export default class Message extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <div class="no-result">
        There is no movies for your request.
      </div>
    `.trim();
  }
}
