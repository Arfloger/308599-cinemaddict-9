import {render, unrender} from "../utils";
import {Position} from "../const";
import Profile from "../components/profile";

export default class ProfileController {
  constructor() {
    this._headerElement = document.querySelector(`.header`);
    this.__profile = null;
  }

  init(userTitle) {
    this._profile = new Profile(userTitle);
    render(this._headerElement, this._profile.getElement(), Position.BEFOREEND);
  }

  unrender() {
    unrender(this._profile.getElement());
    this._profile.removeElement();
  }
}
