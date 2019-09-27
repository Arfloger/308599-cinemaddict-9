import {Position, ChartOptions} from "../const";
import {render} from "../utils";
import Statistic from '../components/statistic';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class StatisticController {
  constructor(container, cards, userTitle) {
    this._container = container;
    this._cards = cards;
    this._userTitle = userTitle;
    this._watchedCounts = 0;
    this._watchedDuration = 0;
    this._genres = ``;
    this._wasWatched = [];
    this._genresCount = {};
    this._topGenre = ``;
    this._chart = null;
    this._statistic = null;
  }

  _getWatchedCounts(cards) {
    cards.forEach((card) => {
      if (!card.wasWatched) {
        return;
      }

      this._wasWatched.push(card);
      this._watchedCounts = card.wasWatched ? this._watchedCounts += 1 : this._watchedCounts;
    });
  }

  _getWatchedDuration(cards) {
    cards.forEach((card) => {
      this._watchedDuration += card.duration;
    });
  }

  _getGenres(cards) {
    let allGenres = ``;
    cards.forEach((card) => {
      allGenres += card.genre;
    });

    allGenres = allGenres.split(` `);
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
          backgroundColor: ChartOptions.COLORS.backgroundColor,
          hoverBackgroundColor: ChartOptions.COLORS.hoverBackgroundColor,
        },
      ],
    };
    const barOptions = {
      plugins: {
        datalabels: {
          font: {size: ChartOptions.OPTIONS.datalabel.fontSize},
          color: ChartOptions.OPTIONS.datalabel.color,
          anchor: ChartOptions.OPTIONS.datalabel.anchor,
          align: ChartOptions.OPTIONS.datalabel.align,
          offset: ChartOptions.OPTIONS.datalabel.offset,
        },
      },
      animation: {
        easing: ChartOptions.OPTIONS.animationEasing
      },
      scales: {
        yAxes: [{
          barThickness: ChartOptions.OPTIONS.yAxes.barThickness,
          ticks: {
            fontColor: ChartOptions.OPTIONS.yAxes.ticks.fontColor,
            padding: ChartOptions.OPTIONS.yAxes.ticks.padding,
            fontSize: ChartOptions.OPTIONS.yAxes.ticks.fontSize,
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

  init() {
    this._getWatchedCounts(this._cards);
    this._getWatchedDuration(this._cards);
    this._getGenres(this._wasWatched);
    this._getTopGanre();

    this._statistic = new Statistic(this._watchedCounts, this._watchedDuration, this._userTitle, this._topGenre);
    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
    this._initChart();
    // statistic.getElement().classList.add(`visually-hidden`);
  }
}
