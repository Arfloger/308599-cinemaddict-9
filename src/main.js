import PageController from "../src/controllers/page-controller";
// import StatisticController from "../src/controllers/statistic-controller";
// import Profile from "../src/components/profile";

import {getFilm} from '../src/data';

const FILM_CARDS = 7;
const mainElement = document.querySelector(`.main`);
const cardMocks = new Array(FILM_CARDS).fill(``).map((it, index) => getFilm(index));


const pageController = new PageController(mainElement, cardMocks);

// const getUserGrade = (cardArr) => {
//   let watchedCount = 0;
//   let watchedTitle;
//   cardArr.forEach((card) => {
//     watchedCount = card.wasWatched ? watchedCount += 1 : watchedCount;
//   });

//   switch (true) {
//     case watchedCount === 0:
//       watchedTitle = ``;
//       break;
//     case watchedCount <= 10:
//       watchedTitle = `novice`;
//       break;
//     case watchedCount <= 20:
//       watchedTitle = `fan`;
//       break;
//     case watchedCount > 20:
//       watchedTitle = `movie buff`;
//       break;
//     default:
//       watchedTitle = ``;
//   }

//   return watchedTitle;
// };
// const userTitle = getUserGrade(cardMocks);
// const profile = new Profile(userTitle);
// const statisticController = new StatisticController(mainElement, cardMocks, userTitle);

const setFooterStatistics = (cards) => {
  const footerStatisticElement = document.querySelector(`.footer__statistics p`);
  footerStatisticElement.textContent = `${cards.length} movies inside`;
};

const init = () => {
  // render(headerElement, profile.getElement(), Position.BEFOREEND);
  pageController.init();
  // statisticController.init();
  setFooterStatistics(cardMocks);
};

init();
