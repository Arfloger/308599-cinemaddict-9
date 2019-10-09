import moment from 'moment';
import {Position, ChartOption} from "../const";
import {render, unrender} from "../utils";
import Statistic from '../components/statistic';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._userTitle = ``;
    this._watchedCounts = 0;
    this._watchedDuration = 0;
    this._genres = ``;
    this._wasWatched = [];
    this._genresCount = {};
    this._topGenre = ``;
    this._chart = null;
    this._statistic = new Statistic();
    this._term = `all-time`;
  }

  _getWatchedCounts(cards) {
    cards.forEach((card) => {
      if (!card.userDetails.alreadyWatched) {
        return;
      }

      this._wasWatched.push(card);
      this._watchedCounts = card.userDetails.alreadyWatched ? this._watchedCounts += 1 : this._watchedCounts;
    });
  }

  _getWatchedDuration(cards) {
    cards.forEach((card) => {
      this._watchedDuration += card.filmInfo.runtime;
    });
  }

  _getGenres(cards) {
    let allGenres = [];
    cards.forEach((card) => {
      allGenres = allGenres.concat(card.filmInfo.genre);
    });

    this._genres = Array.from(new Set(allGenres));

    for (let i = 0; i < this._genres.length; i++) {
      let result = allGenres.filter((it) => {
        return it === this._genres[i];
      });

      this._genresCount[this._genres[i]] = result.length;
    }
  }

  _getTopGanre() {
    const topGenre = Object.entries(this._genresCount);
    topGenre.sort((a, b) => b[1] - a[1]);
    this._topGenre = topGenre[0][0];
  }

  _initChart() {
    const canvasElement = this._statistic.getElement().querySelector(`.statistic__chart`);
    this._chart = new Chart(canvasElement, this._getChart());
  }

  _getChart() {
    const labels = Object.keys(this._genresCount);
    const data = Object.values(this._genresCount);

    const barData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ChartOption.COLORS.backgroundColor,
          hoverBackgroundColor: ChartOption.COLORS.hoverBackgroundColor,
        },
      ],
    };
    const barOptions = {
      plugins: {
        datalabels: {
          font: {size: ChartOption.OPTIONS.datalabel.fontSize},
          color: ChartOption.OPTIONS.datalabel.color,
          anchor: ChartOption.OPTIONS.datalabel.anchor,
          align: ChartOption.OPTIONS.datalabel.align,
          offset: ChartOption.OPTIONS.datalabel.offset,
        },
      },
      animation: {
        easing: ChartOption.OPTIONS.animationEasing
      },
      scales: {
        yAxes: [{
          barThickness: ChartOption.OPTIONS.yAxes.barThickness,
          ticks: {
            fontColor: ChartOption.OPTIONS.yAxes.ticks.fontColor,
            padding: ChartOption.OPTIONS.yAxes.ticks.padding,
            fontSize: ChartOption.OPTIONS.yAxes.ticks.fontSize,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
        }],
      },
      legend: {display: false},
      tooltips: {enabled: false},
    };

    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: barData,
      options: barOptions,
    };
  }

  _update(cards) {
    this.hide();
    this.show(cards, this._userTitle);
  }

  _getTerm(term, cards) {
    switch (term) {
      case `all-time`:
        return cards;
      case `today`:
        return cards.filter((it) => moment().isSame(moment(it.userDetails.watchingDate), `day`));
      case `week`:
        return cards.filter((it) => moment(it.userDetails.watchingDate) > moment().subtract(1, `w`));
      case `month`:
        return cards.filter((it) => moment(it.userDetails.watchingDate) > moment().subtract(1, `months`));
      case `year`:
        return cards.filter((it) => moment(it.userDetails.watchingDate) > moment().subtract(1, `y`));
    }

    return null;
  }

  show(cards, userTitle) {
    const filtredCards = this._getTerm(this._term, cards);
    this._getWatchedCounts(filtredCards);
    this._getWatchedDuration(filtredCards);
    this._getGenres(this._wasWatched);
    this._getTopGanre();
    this._userTitle = userTitle;
    this._statistic = new Statistic(this._watchedCounts, this._watchedDuration, this._userTitle, this._topGenre);
    this._statistic.getElement().querySelector(`[value="${this._term}"]`).checked = true;


    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
    this._initChart();

    this._statistic.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      const targetElement = evt.target;

      if (targetElement.tagName !== `INPUT`) {
        return;
      }

      this._term = targetElement.value;

      this._update(cards);
    });
  }

  hide() {
    this._watchedCounts = 0;
    this._watchedDuration = 0;
    this._genres = ``;
    this._wasWatched = [];
    this._genresCount = {};
    this._topGenre = ``;
    unrender(this._statistic.getElement());
    this._statistic.removeElement();
  }
}
