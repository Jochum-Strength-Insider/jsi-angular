import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import * as moment from 'moment';

interface IDateCircle {
  month: string;
  day: string;
  startOfUnix: number;
}

@Component({
  selector: 'app-diet-date-circles',
  templateUrl: './diet-date-circles.component.html',
  styleUrls: ['./diet-date-circles.component.css']
})
export class DietDateCirclesComponent {
  @Input() queryDate: Date;
  @Input() isAdmin: boolean = false;
  @Output() queryDateChanged = new EventEmitter<{check: boolean; date: number}>();
  currentDate: Date = new Date();
  daysOfWeek: IDateCircle[] = [];

  startOfWeek: moment.Moment;
  endOfWeek: moment.Moment;
  startOfWeekFormatted: string;
  endOfWeekFormatted: string;

  startOfCurrentDayUnix: number;
  startOfQueryDayUnix: number;
  currentWeekUnix: number;
  prevWeekUnix: number;
  nextWeekUnix: number;

  ngOnInit(): void {
    this.queryDate = this.currentDate;
    this.startOfCurrentDayUnix = +moment(this.currentDate).startOf('d').format('x');
    this.currentWeekUnix = +moment(this.currentDate).startOf("w").format('x');
    this.setDateCircles();
  }

   ngOnChanges(changes: SimpleChanges): void {
     ifPropChanged(changes['queryDate'], () =>  this.setDateCircles())
   }

   setDateCircles() {
     this.startOfWeek = moment(this.queryDate).startOf("w");
     this.endOfWeek = moment(this.queryDate).endOf("w");
     this.startOfWeekFormatted = this.startOfWeek.format('MMM DD').toString();
     this.endOfWeekFormatted = this.endOfWeek.format('MMM DD').toString();
     
     this.startOfQueryDayUnix = +moment(this.queryDate).startOf("d").format('x');
      this.prevWeekUnix = +moment(this.queryDate).startOf('w').subtract(1, "w").format('x');
      this.nextWeekUnix = +moment(this.queryDate).startOf('w').add(1, "w").format('x');

     this.daysOfWeek = [0,1,2,3,4,5,6].map(add => {
        const date = moment(this.startOfWeek).add(add, "d")
        const day = date.format('DD');
        const month = date.format('MMM');
        const startOfUnix = +date.startOf('d').format("x");

        return {
          startOfUnix,
          month,
          day
        }
     });
   }

   changeQueryDate(date: number, check: boolean = false){
    this.queryDateChanged.emit({check, date});
   }
}