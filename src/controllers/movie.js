import {Position} from "../const";
import {render} from "../utils";
import Card from "../components/film-card";

export default class MovieController {
  constructor(container, data) {
    this._container = container;
    this._data = data;
    this._card = new Card(data);
    this.init();
  }

  init() {
    render(this._container, this._card.getElement(), Position.BEFOREEND); 
  }
}
