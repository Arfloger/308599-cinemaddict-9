import PageController from "../src/controllers/page-controller";

const mainElement = document.querySelector(`.main`);
const pageController = new PageController(mainElement);

const init = () => {
  pageController.init();
};

init();
