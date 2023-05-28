import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { WeighIn } from '@app/@core/models/weigh-in/weigh-in.model';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import * as moment from 'moment';
import { Observable, Subscription, debounceTime, fromEvent } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-weight-chart',
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.css']
})
export class WeightChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() weighIns: WeighIn[] = [];
  currentDate: Date = new Date();
  chart: Chart;
  month: Date;
  startOf: Date;
  endOf: Date;
  chartTitle: string;
  defaultWeight: number = 180;

  dataSetOptions = {
    label: 'Weight',
    fill: true,
    lineTension: 0.2,
    backgroundColor: 'rgb(255,255,255, 0.1)',
    borderColor: 'white',
    borderWidth: 2,
    pointBorderColor: 'white',
    pointBackgroundColor: '#a76884',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 5,
    pointHitRadius: 10,
  }

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit(): void {
    this.chartTitle = moment().format('MMMM YYYY');
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.chart.resize();
      })

    this.setConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const weighIns = changes['weighIns'].currentValue as WeighIn[];
    if (!weighIns) {
      return;
    }

    if (weighIns.length > 0) {
      this.updateChartWeighIns(weighIns);
    } else {
      this.clearChart();
    }
  }

  setConfig(): any {
    const gridColor = "rgba(255, 255, 255, 0.100)";
    const tickColor = "white";

    const weights = this.weighIns.length > 0 ? this.weighIns.map(x => x.weight) : [this.defaultWeight];
    const days = this.weighIns.map(x => moment(x.date));

    const startOf = moment(this.currentDate).endOf('month').toISOString();
    const endOf = moment(this.currentDate).startOf('month').toISOString();

    const suggestedMax = Math.max(...weights) + 20;
    const suggestedMin = Math.min(...weights) - 20;

    this.chart = new Chart("WeightChart", {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          ...this.dataSetOptions,
          data: weights,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + 'lbs';
                }
                return label;
              },
              title: function (context) {
                return moment(context[0].parsed.x).format('dddd, MMMM Do YYYY');
              }
            }
          }
        },
        animation: {},
        interaction: {
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: false,
            suggestedMax: suggestedMax,
            suggestedMin: suggestedMin,
            ticks: {
              callback: (value: any) => {
                if (Number.isInteger(value)) {
                  return `${value}`;
                } else {
                  return;
                }
              },
              stepSize: 5,
              color: tickColor,
            },
            grid: {
              color: gridColor
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date',
              color: tickColor,
            },
            type: 'time',
            time: {
              unit: 'day',
              minUnit: 'day',
              round: 'day',
              displayFormats: {
                day: 'D'
              }
            },
            suggestedMax: startOf,
            suggestedMin: endOf,
            ticks: {
              color: tickColor,
              stepSize: 1,
            },
            grid: {
              color: gridColor
            },
          },
        },
      }
    });
  }

  updateChartWeighIns(weighIns: WeighIn[]) {
    this.clearChart();
    this.chart.data.labels = weighIns.map(w => w.date);
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data = weighIns.map(w => w.weight);
    });
    this.chart.update();
  }

  clearChart() {
    if (this.chart) {
      this.chart.data.labels = [];
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });
      this.chart.update('none');
    }
  }

  removeData() {
    this.chart.data?.labels?.pop();
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe()
  }
}
