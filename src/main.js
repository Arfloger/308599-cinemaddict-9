import {render} from '../src/utils';
import {Position} from "./const";

import PageController from "../src/controllers/page-controller";
import SearchController from "../src/controllers/search-controller";
import MenuController from "../src/controllers/menu-controller";
import Search from "../src/components/search";
import Profile from "../src/components/profile";
import Menu from "../src/components/menu";
import Statistic from "../src/components/statistic";

import {getFilm, getComments} from '../src/data';

const FILM_CARDS = 7;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const cardMocks = new Array(FILM_CARDS).fill(``).map((it, index) => getFilm(index));
const menu = new Menu(cardMocks);
const statistics = new Statistic();
const search = new Search();
const pageController = new PageController(mainElement, cardMocks, search, getComments());
const searchController = new SearchController(mainElement, search, cardMocks);
const menuController = new MenuController(menu, mainElement);

const renderProfile = () => {
  const userTitle = getUserGrade(cardMocks);
  const profile = new Profile(userTitle);

  render(headerElement, profile.getElement(), Position.BEFOREEND);
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


menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `A`) {
    return;
  }

  if (evt.target.classList.contains(`main-navigation__item--active`)) {
    return;
  }

  menu.getElement().querySelectorAll(`.main-navigation__item`)
    .forEach((item) => item.classList.remove(`main-navigation__item--active`));

  evt.target.classList.add(`main-navigation__item--active`);

  switch (evt.target.classList.contains(`main-navigation__item--additional`)) {
    case true:
      statistics.getElement().classList.remove(`visually-hidden`);
      pageController.hide();
      break;
    case false:
      statistics.getElement().classList.add(`visually-hidden`);
      pageController.show();
      break;
  }
});

const init = () => {
  render(headerElement, search.getElement(), Position.BEFOREEND);
  renderProfile();
  pageController.init();
  searchController.init();
  menuController.init();
  render(mainElement, statistics.getElement(), Position.BEFOREEND);
  statistics.getElement().classList.add(`visually-hidden`);

  setFooterStatistics(cardMocks);
};

init();
