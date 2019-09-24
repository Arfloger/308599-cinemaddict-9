import {minMaxRandomRange, getRandomValue, compareRandom, getRandomBoolean} from '../src/utils';

const FILM_TITLES = [
  `One film`,
  `Two film`,
  `Three film`,
  `Four film`,
  `Five film`,
  `Six film`,
  `Seven film`
];

const FILM_POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const FILM_GENRES = [`Musical`, `Sitcom`, `Comedy`, `Thriller`, `Detective`];

const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];

const COMMENT_AUTHORS = [`Tom`, `Oxxximiron`, `Darth Vader`];

const getRandomText = () => {
  const randomText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `).sort(compareRandom);

  return randomText.slice(0, minMaxRandomRange(1, 3)).join(`. `);
};

export const getFilm = (index) => ({
  filmId: index,
  title: FILM_TITLES[index],
  poster: FILM_POSTERS[index],
  description: getRandomText(),
  genre: FILM_GENRES[getRandomValue(FILM_GENRES.length - 1)],
  rating: `${minMaxRandomRange(5, 9)}.${minMaxRandomRange(0, 9)}`,
  duration: 77,
  isToWatchlist: getRandomBoolean(),
  wasWatched: getRandomBoolean(),
  isFavorite: getRandomBoolean(),
  releaseDate: getRandomValue(1475924187819),
});

const getComment = () => ({
  textCom: getRandomText(),
  emoji: EMOTIONS[getRandomValue(EMOTIONS.length - 1)],
  author: COMMENT_AUTHORS[getRandomValue(COMMENT_AUTHORS.length - 1)],
  date: Date.now(),
});

export const getComments = () => {
  const comments = [];
  const randomQuantity = minMaxRandomRange(1, 4);

  for (let i = 0; i < randomQuantity; i++) {
    comments.push(getComment());
  }

  return comments;
};

