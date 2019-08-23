export const minMaxRandomRange = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));
export const getRandomValue = (num) => Math.floor(Math.random() * num);
export const compareRandom = () => Math.random() - 0.5;
export const getRandomBoolean = () => Boolean(Math.round(Math.random()));
