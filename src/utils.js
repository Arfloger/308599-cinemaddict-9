export const minMaxRandomRange = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));
export const getRandomValue = (num) => Math.floor(Math.random() * num);
export const compareRandom = () => Math.random() - 0.5;
export const getRandomBoolean = () => Boolean(Math.round(Math.random()));

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
