// import {Position} from "../const.js";
// import {render, unrender} from "../utils.js";
// import Films from "./films.js";
// import FilmsList from "./films-list.js";
// import FilmsListContainer from "./films-list-container.js";
// import ShowMore from "./show-more.js";

// export default class PageController {
//   constructor(container, cards) {
//     this._MAX_CARD_TO_SHOW = 5;
//     this._tasksOnPage = 0;
//     this._leftCardsToRender = 0;
//     this._container = container;
//     this._cards = cards;
//     this._films = new Films();
//     this._filmsList = new FilmsList();
//     this._filmsListContainer = new FilmsListContainer();
//     this._showMore = new ShowMore();
//   }

//   init() {
//     render(this._container, this._films.getElement(), Position.BEFOREEND);
//     render(this._films.getElement(), this._filmsList.getElement(), Position.BEFOREEND);
//     render(this._filmsList.getElement(), this._filmsListContainer.getElement(), Position.BEFOREEND);
//     this._leftCardsToRender = this._cards.length - this._tasksOnPage;
//     // this._renderLoadMore();
//     // this._showTasks(this._tasks);
//   }

//   _showTasks(tasks) {
//     for (let i = 0; i < tasks.length; i++) {
//       if (tasks[i].isArchive) {
//         tasks.splice(i, 1);
//         i--;
//       }
//     }

//     if (tasks.length === 0) {
//       this._renderMessage();
//       unrender(this._loadMore.getElement());
//       return;
//     }

//     if (tasks.length <= this._MAX_CARD_TO_SHOW) {
//       tasks.slice(0).map((task) => this._renderTask(task))
//       .join(``);
//       unrender(this._loadMore.getElement());
//       return;
//     }

//     tasks.slice(this._tasksOnPage, this._tasksOnPage + this._MAX_CARD_TO_SHOW).map((task) => this._renderTask(task))
//     .join(``);

//     this._tasksOnPage = this._tasksOnPage + this._MAX_CARD_TO_SHOW;
//     this._leftCardsToRender = tasks.length - this._tasksOnPage;

//     if (this._leftCardsToRender <= 0) {
//       unrender(this._loadMore.getElement());
//     }
//   }

//   _renderTask(task) {
//     const taskComponent = new Task(task);
//     const taskEditComponent = new TaskEdit(task);

//     const onEscKeyDown = (evt) => {
//       if (evt.key === `Escape` || evt.key === `Esc`) {
//         this._taskList
//           .getElement()
//           .replaceChild(
//               taskComponent.getElement(),
//               taskEditComponent.getElement()
//           );
//         document.removeEventListener(`keydown`, onEscKeyDown);
//       }
//     };

//     taskComponent
//       .getElement()
//       .querySelector(`.card__btn--edit`)
//       .addEventListener(`click`, () => {
//         this._taskList.replaceChild(
//             taskEditComponent.getElement(),
//             taskComponent.getElement()
//         );
//         document.addEventListener(`keydown`, onEscKeyDown);
//       });

//     taskEditComponent
//       .getElement()
//       .querySelector(`textarea`)
//       .addEventListener(`focus`, () => {
//         document.removeEventListener(`keydown`, onEscKeyDown);
//       });

//     taskEditComponent
//       .getElement()
//       .querySelector(`textarea`)
//       .addEventListener(`blur`, () => {
//         document.addEventListener(`keydown`, onEscKeyDown);
//       });

//     taskEditComponent
//       .getElement()
//       .querySelector(`.card__save`)
//       .addEventListener(`click`, () => {
//         this._taskList.replaceChild(
//             task.getElement(),
//             taskEditComponent.getElement()
//         );
//         document.removeEventListener(`keydown`, onEscKeyDown);
//       });

//     render(this._taskList.getElement(), taskComponent.getElement(), Position.BEFOREEND);
//   }

//   _renderMessage() {
//     const message = new Message();
//     render(this._taskList.getElement(), message.getElement(), Position.BEFOREEND);
//   }

//   _renderLoadMore() {
//     render(this._board.getElement(), this._loadMore.getElement(), Position.BEFOREEND);

//     this._loadMore.getElement().addEventListener(`click`, () => {
//       this._showTasks(this._tasks);
//     });
//   }
// }
