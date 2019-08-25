import {Position, render} from '../src/utils.js';

import Search from "../src/components/search.js";
import Profile from "../src/components/profile.js";
import Menu from "../src/components/menu.js";
import Sort from "../src/components/sort.js";
import Card from "../src/components/film-card.js";
import ShowMore from "../src/components/show-more.js";
import ExtraCard from "../src/components/extra.js";
import Popup from "../src/components/popup.js";

import {getFilm} from '../src/data.js';

// const MAX_CARD_TO_SHOW = 5;
const FILM_CARDS = 7;
// const FILM_EXTRA_CARDS = 2;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

let filmElement;
let filmListElement;
let filmListContainer;
// let showMoreButtonElement;
// let tasksOnPage = 0;
// let leftCardsToRender = 0;
// let popupElement;

const createfilmMarkup = () => {
  filmElement = document.createElement(`section`);
  filmListElement = document.createElement(`section`);
  filmListContainer = document.createElement(`div`);
  filmElement.classList.add(`films`);
  filmListElement.classList.add(`films-list`);
  mainElement.appendChild(filmElement);
  filmElement.appendChild(filmListElement);
  filmListContainer.classList.add(`films-list__container`);
  filmListElement.appendChild(filmListContainer);
};

// const onShowMoreButtonClick = () => {
//   showCards(filmListElement, cards);
// };

// const showCards = (insertPlace, cardsArr) => {

//   insertPlace.insertAdjacentHTML(
//       `beforebegin`,
//       cardsArr
//       .map(createFilmCardTemplate)
//       .slice(tasksOnPage, tasksOnPage + MAX_CARD_TO_SHOW)
//       .join(``));

//   tasksOnPage += MAX_CARD_TO_SHOW;
//   leftCardsToRender = FILM_CARDS - tasksOnPage;

//   if (leftCardsToRender <= 0) {
//     showMoreButtonElement.classList.add(`visually-hidden`);
//     showMoreButtonElement.addEventListener(`click`, onShowMoreButtonClick);
//   }
// };

// const addListenerForMoreButton = () => {
//   showMoreButtonElement = document.querySelector(`.films-list__show-more`);
//   showMoreButtonElement.addEventListener(`click`, onShowMoreButtonClick);
// };

const setFooterStatistics = (cardMocks) => {
  const footerStatisticElement = document.querySelector(`.footer__statistics p`);
  footerStatisticElement.textContent = `${cardMocks.length} movies inside`;
};

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

const renderShowMore = () => {
  const showMore = new ShowMore();

  render(filmListElement, showMore.getElement(), Position.BEFOREEND);
};

const renderExtraCard = (title) => {
  const extraCard = new ExtraCard(title);
  render(filmElement, extraCard.getElement(), Position.BEFOREEND);
};

const renderCard = (cardMock) => {
  const card = new Card(cardMock);
  render(filmListContainer, card.getElement(), Position.BEFOREEND);
  const filmsImages = Array.from(document.querySelectorAll(`.film-card__poster`));

  for (let item of filmsImages) {
    item.addEventListener(`click`, function () {
      const popup = new Popup(cardMock);
      render(footerElement, popup.getElement(), Position.AFTERBEGIN);
    });
  }

};

const getUserGrade = (cardMocks) => {
  let watchedCount = 0;
  let watchedTitile;
  cardMocks.forEach((card) => {
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
      watchedTitile = `movie buff`;
      break;
    default:
      watchedTitile = ``;
  }

  return watchedTitile;
};

const renderFilter = (cardMocks) => {
  const filtersList = {
    Watchlist: 0,
    History: 0,
    Favorites: 0
  };

  cardMocks.forEach((card) => {
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

const cardMocks = new Array(FILM_CARDS).fill(``).map((it, index) => getFilm(index));
// const cardExtraMocks = new Array(FILM_EXTRA_CARDS).fill(``).map((it, index) => getFilm(index));

const init = () => {
  renderSearch();
  renderProfile();
  renderFilter(cardMocks);
  renderSort();
  createfilmMarkup();
  cardMocks.map((cardMock) => renderCard(cardMock));
  renderShowMore();
  renderExtraCard(`Top rated`);
  renderExtraCard(`Most commented`);
  setFooterStatistics(cardMocks);

  // showCards(filmListElement, cards);
  // leftCardsToRender = cards.length - tasksOnPage;
  // addListenerForMoreButton();
  // createPopup();
};

init();
