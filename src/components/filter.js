import {AbstractComponent} from "../components/abstract-component";

export default class Filter extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
    this._filters = this.getFilterCount();
  }

  getFilterCount() {
    const filtersList = {
      Watchlist: 0,
      History: 0,
      Favorites: 0
    };

    this._cards.forEach((card) => {
      filtersList.Watchlist = card.userDetails.watchlist ? filtersList.Watchlist += 1 : filtersList.Watchlist;

      filtersList.History = card.userDetails.alreadyWatched ? filtersList.History += 1 : filtersList.History;

      filtersList.Favorites = card.userDetails.favorite ? filtersList.Favorites += 1 : filtersList.Favorites;
    });

    const filters = [];

    for (let [key, value] of Object.entries(filtersList)) {
      filters.push({
        title: key,
        count: value
      });
    }

    return filters;
  }

  getTemplate() {
    return `
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${this._filters.map((filter) => `<a href="#${filter.title}" class="main-navigation__item">${filter.title} 
      <span class="main-navigation__item-count">${filter.count}</span></a>`).join(``)}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>
    `.trim();
  }
}
