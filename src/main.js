/* eslint-disable no-unused-expressions */
import {minMaxRandomRange, compareRandom, getRandomValue} from '../src/utils.js';
import {getFilm} from '../src/data.js';

import {createFilters} from '../src/components/menu.js';
import {createProfile} from '../src/components/profile.js';

import {createSearchTemplate} from '../src/components/search.js';
import {createSortTemplate} from '../src/components/sort.js';
import {createFilmCardTemplate} from '../src/components/film-card.js';
import {createShowMoreTemplate} from '../src/components/show-more.js';
import {createPopupTemplate} from '../src/components/popup.js';

const MAX_CARD_TO_SHOW = 5;
const FILM_CARDS = 7;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const filmElement = document.createElement(`section`);
const filmListElement = document.createElement(`section`);
let showMoreButtonElement;
let cards;
let tasksOnPage = 0;
let leftCardsToRender = 0;
let popupElement;

const renderElement = (insertPlace, callback, insertProperty = `beforeend`) => {
  insertPlace.insertAdjacentHTML(insertProperty, callback());
};

const createCardsElement = (insertPlase, quantity) => {
  const filmListContainer = document.createElement(`div`);
  filmListContainer.classList.add(`films-list__container`);

  for (let i = 0; i < quantity; i++) {
    renderElement(filmListContainer, createFilmCardTemplate);
  }

  insertPlase.appendChild(filmListContainer);
};

const createExtraElement = (titleText, quantity = 2) => {
  const filmExtraElement = document.createElement(`section`);
  filmExtraElement.classList.add(`films-list--extra`);
  filmElement.appendChild(filmExtraElement);

  const filmExtraTitle = document.createElement(`h2`);
  filmExtraTitle.classList.add(`films-list__title`);
  filmExtraTitle.textContent = titleText;
  filmExtraElement.appendChild(filmExtraTitle);

  createCardsElement(filmExtraElement, quantity);
};

const insertFilmsElement = () => {
  filmElement.classList.add(`films`);
  filmListElement.classList.add(`films-list`);
  mainElement.appendChild(filmElement);
  filmElement.appendChild(filmListElement);
};

const createCards = (count) => {
  const currentCards = [];
  for (let i = 0; i < count; i++) {
    currentCards.push(getFilm(i));
  }
  return currentCards;
};

const onShowMoreButtonClick = () => {
  showCards(filmListElement, cards);
};

const showCards = (insertPlace, cardsArr) => {

  insertPlace.insertAdjacentHTML(
      `beforebegin`,
      cardsArr
      .map(createFilmCardTemplate)
      .slice(tasksOnPage, tasksOnPage + MAX_CARD_TO_SHOW)
      .join(``));

  tasksOnPage += MAX_CARD_TO_SHOW;
  leftCardsToRender = FILM_CARDS - tasksOnPage;

  if (leftCardsToRender <= 0) {
    showMoreButtonElement.classList.add(`visually-hidden`);
    showMoreButtonElement.addEventListener(`click`, onShowMoreButtonClick);
  }
};

const getFilters = (cardsArr) => {
  const filters = {
    Watchlist: 0,
    History: 0,
    Favorites: 0
  };

  cardsArr.forEach((card) => {
    filters.Watchlist = card.isToWatchlist ? filters.Watchlist += 1 : filters.Watchlist;

    filters.History = card.wasWatched ? filters.History += 1 : filters.History;

    filters.Favorites = card.isFavorite ? filters.Favorites += 1 : filters.Favorites;
  });

  return filters;
};

const renderFilters = (container, filtersArr) => {
  const convertFilters = [];

  for (let [key, value] of Object.entries(filtersArr)) {
    convertFilters.push({
      title: key,
      count: value
    });
  }

  container.insertAdjacentHTML(`beforebegin`, createFilters(convertFilters));
};

const getUserGrade = (container, cardsArr) => {
  let watchedCount = 0;
  let watchedTitile;
  cardsArr.forEach((card) => {
    watchedCount = card.wasWatched ? watchedCount += 1 : watchedCount;
  });

  switch (true) {
    case watchedCount === 0:
      watchedTitile = ``;
      break;
    case watchedCount <= 10:
      watchedTitile = `novice`;
      break;
    case watchedCount <= 20:
      watchedTitile = `fan`;
      break;
    case watchedCount > 20:
      watchedTitile = `movie buff;`;
      break;
    default:
      watchedTitile = ``;
  }

  container.insertAdjacentHTML(`beforeend`, createProfile(watchedTitile));
};

const setFooterStatistics = (cardsArr) => {
  const footerStatisticElement = document.querySelector(`.footer__statistics p`);
  footerStatisticElement.textContent = `${cardsArr.length} movies inside`;
};

const createPopup = () => {
  const filmsImages = Array.from(document.querySelectorAll(`.film-card__poster`));
  for (let item of filmsImages) {
    item.addEventListener(`click`, function () {
      const targetElement = filmsImages.indexOf(item);

      footerElement.insertAdjacentHTML(`afterend`, createPopupTemplate(cards[targetElement]));
    });
  }
};

const createfilmListMarkup = () => {
  const filmListContainer = document.createElement(`div`);
  filmListContainer.classList.add(`films-list__container`);
  filmListElement.appendChild(filmListContainer);
};

const addListenerForMoreButton = () => {
  showMoreButtonElement = document.querySelector(`.films-list__show-more`);
  showMoreButtonElement.addEventListener(`click`, onShowMoreButtonClick);
};

const init = () => {
  renderElement(headerElement, createSearchTemplate);
  renderElement(mainElement, createSortTemplate);
  insertFilmsElement();
  cards = createCards(FILM_CARDS);
  createfilmListMarkup();
  showCards(filmListElement, cards);
  leftCardsToRender = cards.length - tasksOnPage;
  renderElement(filmListElement, createShowMoreTemplate);
  addListenerForMoreButton();
  const filters = getFilters(cards);
  renderFilters(mainElement, filters);
  getUserGrade(headerElement, cards);
  setFooterStatistics(cards);
  // createExtraElement(`Top rated`);
  // createExtraElement(`Most commented`);
  createPopup();
};

init();
