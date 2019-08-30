import {render} from '../src/utils.js';
import {Position} from "./const.js";

import PageController from "../src/components/page-controller.js";
import Search from "../src/components/search.js";
import Profile from "../src/components/profile.js";
import Menu from "../src/components/menu.js";
import Sort from "../src/components/sort.js";

import {getFilm} from '../src/data.js';

const FILM_CARDS = 3;
const FILM_EXTRA_CARDS = 2;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const cardMocks = new Array(FILM_CARDS).fill(``).map((it, index) => getFilm(index));
const cardExtraMocks = new Array(FILM_EXTRA_CARDS).fill(``).map((it, index) => getFilm(index));
const pageController = new PageController(mainElement, cardMocks, cardExtraMocks);

const renderSearch = () => {
  const search = new Search();

  render(headerElement, search.getElement(), Position.BEFOREEND);
};

const renderProfile = () => {
  const userTitle = getUserGrade(cardMocks);
  const profile = new Profile(userTitle);

  render(headerElement, profile.getElement(), Position.BEFOREEND);
};

const renderSort = () => {
  const sort = new Sort();
  render(mainElement, sort.getElement(), Position.BEFOREEND);
};

const renderFilter = (cards) => {
  const filtersList = {
    Watchlist: 0,
    History: 0,
    Favorites: 0
  };

  cards.forEach((card) => {
    filtersList.Watchlist = card.isToWatchlist ? filtersList.Watchlist += 1 : filtersList.Watchlist;

    filtersList.History = card.wasWatched ? filtersList.History += 1 : filtersList.History;

    filtersList.Favorites = card.isFavorite ? filtersList.Favorites += 1 : filtersList.Favorites;
  });

  const filters = [];

  for (let [key, value] of Object.entries(filtersList)) {
    filters.push({
      title: key,
      count: value
    });
  }

  const filter = new Menu(filters);
  render(mainElement, filter.getElement(), Position.BEFOREEND);
};

const getUserGrade = (cardArr) => {
  let watchedCount = 0;
  let watchedTitle;
  cardArr.forEach((card) => {
    watchedCount = card.wasWatched ? watchedCount += 1 : watchedCount;
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
};

const setFooterStatistics = (cards) => {
  const footerStatisticElement = document.querySelector(`.footer__statistics p`);
  footerStatisticElement.textContent = `${cards.length} movies inside`;
};

const init = () => {
  renderSearch();
  renderProfile();
  renderFilter(cardMocks);
  renderSort();
  setFooterStatistics(cardMocks);
  pageController.init();
};

init();
