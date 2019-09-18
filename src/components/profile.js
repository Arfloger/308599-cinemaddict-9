import {AbstractComponent} from "../components/abstract-component";

export default class Profile extends AbstractComponent {
  constructor(watchedCount) {
    super();
    this._watchedCount = watchedCount;
  }

  getTemplate() {
    return `
    <section class="header__profile profile">
    <p class="profile__rating">${this._watchedCount}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
    `.trim();
  }
}
