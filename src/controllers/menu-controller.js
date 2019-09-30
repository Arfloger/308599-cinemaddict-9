import {Position} from "../const";
import {render} from "../utils";
import Menu from "../components/menu";

export default class MenuController {
  constructor(container) {
    this._container = container;
  }

  init(cards) {

    this._menu = new Menu(cards);
    render(this._container, this._menu.getElement(), Position.AFTERBEGIN);

    this._menu.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.classList.contains(`main-navigation__item--active`)) {
        return;
      }

      this._menu.getElement().querySelectorAll(`.main-navigation__item`)
        .forEach((item) => item.classList.remove(`main-navigation__item--active`));

      evt.target.classList.add(`main-navigation__item--active`);
      const currentNavElement = evt.target.href.slice(evt.target.href.indexOf(`#`));

      // this._mainFilmsContainer.innerHTML = ``;


      // unrender(this._mainFilmsContainer.getElement());
      // this._mainFilmsContainer.removeElement();
      // render(this._filmsList.getElement(), this._mainFilmsContainer.getElement(), Position.BEFOREEND);
      // let filterCards;

      // switch (currentNavElement) {
      //   case `#all`:
      //     filterCards = cards;
      //     break;
      //   case `#Watchlist`:
      //     filterCards = cards.filter((it) => {
      //       return it.userDetails.watchlist === true;
      //     });
      //     break;
      //   case `#History`:
      //     filterCards = cards.filter((it) => {
      //       return it.userDetails.alreadyWatched === true;
      //     });
      //     break;
      //   case `#Favorites`:
      //     filterCards = cards.filter((it) => {
      //       return it.userDetails.favorite === true;
      //     });
      //     break;
      // }

      // this._filmContainer = document.querySelector(`.films-list`);
      // const filmListController = new FilmListController(this._filmContainer);
      // filmListController.showCards(filterCards);

    });
  }

}
