import {createSiteSearchTemplate} from '../src/components/site-search.js';
import {createSiteProfileTemplate} from '../src/components/site-profile.js';
import {createSiteMenuTemplate} from '../src/components/site-menu.js';
import {createSiteSortTemplate} from '../src/components/site-sort.js';
import {createSiteFilmCardTemplate} from '../src/components/site-film-card.js';
import {createSiteShowMoreTemplate} from '../src/components/site-show-more.js';
import {createSitePopupTemplate} from '../src/components/site-popup.js';

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const filmElement = document.createElement(`section`);
const filmListElement = document.createElement(`section`);
filmElement.classList.add(`films`);
filmListElement.classList.add(`films-list`);

const renderSomeElement = (insertPlace, callback, insertProperty = `beforeend`) => {
  insertPlace.insertAdjacentHTML(insertProperty, callback());
};

const createCardsElement = (insertPlase, quantity) => {
  const filmListContainer = document.createElement(`div`);
  filmListContainer.classList.add(`films-list__container`);

  for (let i = 0; i < quantity; i++) {
    renderSomeElement(filmListContainer, createSiteFilmCardTemplate);
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

const init = () => {
  renderSomeElement(headerElement, createSiteSearchTemplate);
  renderSomeElement(headerElement, createSiteProfileTemplate);

  renderSomeElement(mainElement, createSiteMenuTemplate);
  renderSomeElement(mainElement, createSiteSortTemplate);

  mainElement.appendChild(filmElement);
  filmElement.appendChild(filmListElement);

  createCardsElement(filmListElement, 5);
  renderSomeElement(filmListElement, createSiteShowMoreTemplate);

  createExtraElement(`Top rated`);
  createExtraElement(`Most commented`);

  renderSomeElement(footerElement, createSitePopupTemplate, `afterend`);
};

init();
