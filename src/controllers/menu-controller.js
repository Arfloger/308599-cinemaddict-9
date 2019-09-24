import {Position} from "../const";
import {render} from "../utils";

export default class MenuController {
  constructor(menu, container) {
    this._menu = menu;
    this._container = container;
  }

  init() {
    render(this._container, this._menu.getElement(), Position.AFTERBEGIN);
  }

}
