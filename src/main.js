import {createSearchTemplate} from '../src/components/search.js';
import {createProfileTemplate} from '../src/components/profile.js';
import {createMenuTemplate} from '../src/components/menu.js';
import {createSortTemplate} from '../src/components/sort.js';
import {createFilmCardTemplate} from '../src/components/film-card.js';
import {createShowMoreTemplate} from '../src/components/show-more.js';
import {createPopupTemplate} from '../src/components/popup.js';

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const filmElement = document.createElement(`section`);
const filmListElement = document.createElement(`section`);

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

const init = () => {
  renderElement(headerElement, createSearchTemplate);
  renderElement(headerElement, createProfileTemplate);

  renderElement(mainElement, createMenuTemplate);
  renderElement(mainElement, createSortTemplate);

  insertFilmsElement();

  createCardsElement(filmListElement, 5);
  renderElement(filmListElement, createShowMoreTemplate);

  createExtraElement(`Top rated`);
  createExtraElement(`Most commented`);

  renderElement(footerElement, createPopupTemplate, `afterend`);
};

init();
