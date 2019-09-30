import {render} from "../utils";
import {Position} from "../const";
import Profile from "../components/profile";

export default class ProfileController {
  constructor() {
    this._headerElement = document.querySelector(`.header`);
  }

  init(cards) {
    const userTitle = this._getUserGrade(cards);
    this._profile = new Profile(userTitle);
    render(this._headerElement, this._profile.getElement(), Position.BEFOREEND);
  }

  _getUserGrade(cards) {
    let watchedCount = 0;
    let watchedTitle;
    cards.forEach((card) => {
      watchedCount = card.userDetails.alreadyWatched ? watchedCount += 1 : watchedCount;
    });

    switch (true) {
      case watchedCount === 0:
        watchedTitle = ``;
        break;
      case watchedCount <= 10:
        watchedTitle = `novice`;
        break;
      case watchedCount <= 20:
        watchedTitle = `fan`;
        break;
      case watchedCount > 20:
        watchedTitle = `movie buff`;
        break;
      default:
        watchedTitle = ``;
    }

    return watchedTitle;
  }
}
