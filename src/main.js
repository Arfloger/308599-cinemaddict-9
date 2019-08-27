import {render, unrender} from '../src/utils.js';
import {Position} from "./const.js";

import Search from "../src/components/search.js";
import Profile from "../src/components/profile.js";
import Menu from "../src/components/menu.js";
import Sort from "../src/components/sort.js";
import Card from "../src/components/film-card.js";
import ShowMore from "../src/components/show-more.js";
import ExtraCard from "../src/components/extra.js";
import Popup from "../src/components/popup.js";

import {getFilm} from '../src/data.js';

const MAX_CARD_TO_SHOW = 5;
const FILM_CARDS = 7;
const FILM_EXTRA_CARDS = 2;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const cardMocks = new Array(FILM_CARDS).fill(``).map((it, index) => getFilm(index));
const cardExtraMocks = new Array(FILM_EXTRA_CARDS).fill(``).map((it, index) => getFilm(index));
let filmElement;
let filmListElement;
let filmListContainer;
let showMoreButtonElement;
let tasksOnPage = 0;
let leftCardsToRender = 0;

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

const onShowMoreButtonClick = () => {
  showCards(cardMocks);
};

const showCards = (cardsArr) => {
  cardsArr
      .slice(tasksOnPage, tasksOnPage + MAX_CARD_TO_SHOW)
      .map((card) => renderCard(card, filmListContainer))
      .join(``);

  tasksOnPage += MAX_CARD_TO_SHOW;
  leftCardsToRender = FILM_CARDS - tasksOnPage;

  if (leftCardsToRender <= 0) {
    showMoreButtonElement.removeEventListener(`click`, onShowMoreButtonClick);
    unrender(showMoreButtonElement);
  }
};

const addListenerForMoreButton = () => {
  showMoreButtonElement = document.querySelector(`.films-list__show-more`);
  showMoreButtonElement.addEventListener(`click`, onShowMoreButtonClick);
};

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
  const extraCardContainerElement = extraCard.getElement().querySelector(`.films-list__container`);

  render(filmElement, extraCard.getElement(), Position.BEFOREEND);
  cardExtraMocks.map((card) => renderCard(card, extraCardContainerElement));
};

const renderCard = (cardMock, container) => {
  const card = new Card(cardMock);
  const popup = new Popup(cardMock);

  const onRenderPopupClick = () => {
    render(mainElement, popup.getElement(), Position.BEFOREEND);
  };

  const onUnrenderPopupClick = () => {
    unrender(popup.getElement());
  };

  card.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onRenderPopupClick);

  popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onUnrenderPopupClick);

  render(container, card.getElement(), Position.BEFOREEND);
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

const init = () => {
  renderSearch();
  renderProfile();
  renderFilter(cardMocks);
  renderSort();
  createfilmMarkup();
  renderShowMore();
  renderExtraCard(`Top rated`);
  renderExtraCard(`Most commented`);
  setFooterStatistics(cardMocks);
  showCards(cardMocks);
  leftCardsToRender = cardMocks.length - tasksOnPage;
  addListenerForMoreButton();
};

init();
