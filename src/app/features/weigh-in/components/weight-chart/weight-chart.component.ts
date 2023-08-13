import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { WeighIn } from '@app/@core/models/weigh-in/weigh-in.model';
import { ResizeService } from '@app/@core/services/resize.service';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import * as moment from 'moment';
import { Subscription, debounceTime, delay, fromEvent } from 'rxjs';
import { DATASET_OPTIONS, GRID_COLOR, TICK_COLOR } from './chart-options';
Chart.register(...registerables);

@Component({
  selector: 'app-weight-chart',
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.css']
})
export class WeightChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() weighIns: WeighIn[] = [];
  @ViewChild('container') container: ElementRef;

  currentDate: Date = new Date();
  chart: Chart;
  month: Date;
  startOf: Date;
  endOf: Date;
  defaultWeight: number = 180;
  resizeSubscription$: Subscription;
  panelSubscription$: Subscription;

  constructor(
    private renderer: Renderer2,
    private resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    this.resizeSubscription$ = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.chart.resize();
      })

    this.panelSubscription$ = this.resizeService.adminPanel$
      .pipe(delay(0))
      .subscribe(() => {
        this.chart.resize();
      })
  }

  ngAfterViewInit(): void {
    this.createCanvas();
    this.initChart();
  }

  ngOnDestroy() {
    this.resizeSubscription$?.unsubscribe();
    this.panelSubscription$?.unsubscribe();
    this.chart?.destroy();
    this.container?.nativeElement.remove();
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['weighIns'], (weighIns: WeighIn[]) =>  {
      if (!weighIns) {
        return;
      }
  
      if (weighIns.length > 0) {
        this.updateChartWeighIns(weighIns);
      } else {
        this.clearChart();
      }
    })
  }

  initChart(): any {
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
          ...DATASET_OPTIONS,
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
              color: TICK_COLOR,
            },
            grid: {
              color: GRID_COLOR
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date',
              color: TICK_COLOR,
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
              color: TICK_COLOR,
              stepSize: 1,
            },
            grid: {
              color: GRID_COLOR
            },
          },
        },
      }
    });
  }

  updateChartWeighIns(weighIns: WeighIn[]) {
    this.clearChart();
    if(this.chart){
      this.chart.data.labels = weighIns.map(w => w.date);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data = weighIns.map(w => w.weight);
      });
      this.chart.update();
    }
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
    if(this.chart){
      this.chart.data?.labels?.pop();
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      });
    }
  }

  createCanvas(){
    let canvas = this.renderer.createElement('canvas');
    canvas.id = 'WeightChart';
    this.container.nativeElement.appendChild(canvas);
  }
}
