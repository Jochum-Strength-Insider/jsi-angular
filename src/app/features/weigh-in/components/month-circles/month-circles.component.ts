import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

interface IMonthCircle {
  formatted: string;
  unix: number;
  month: string;
}

@Component({
  selector: 'app-month-circles',
  templateUrl: './month-circles.component.html',
  styleUrls: ['./month-circles.component.css']
})
export class MonthCirclesComponent implements OnInit, OnChanges {
  @Input() queryDate: Date;
  @Output() queryDateChanged = new EventEmitter<number>();
  currentDate: Date = new Date();
  startOfMonth: moment.Moment;
  nowUnix: number;
  prevMonth: number;
  nextMonth: number;
  nextMonthUnix: number;
  disabled: boolean = false;
  pastMonths: IMonthCircle[] = [];
  futureMonths: IMonthCircle[] = [];
  thisMonth: IMonthCircle;

   ngOnInit(): void {
    this.setDateCircles();
   }

   ngOnChanges(changes: SimpleChanges): void {
     if(!changes['queryDate']?.firstChange && changes['queryDate']?.currentValue){
      this.setDateCircles();
     }
   }

   setDateCircles() {
    this.startOfMonth = moment(this.queryDate).startOf("M");

    this.nowUnix = this.currentDate.getTime();
    this.prevMonth = +moment(this.startOfMonth).subtract(1, "M").format('x');
    this.nextMonth = +moment(this.startOfMonth).add(1, "M").format('x');
    this.nextMonthUnix = +moment(this.queryDate).add(1, "M").format('x');
    this.disabled = this.nextMonthUnix > this.nowUnix;
  
     this.pastMonths = [2, 1].map(sub => {
        const date = moment(this.startOfMonth).subtract(sub, "M")
        const formatted = date.format('YYYY-MM-DD');
        const month = date.format('MMM');
        const unix = +date.format("x");
        return {
           formatted,
           unix,
           month
        }
     });
  
     this.thisMonth = {
        formatted: moment(this.startOfMonth).format('YYYY-MM-DD'),
        unix: +moment(this.startOfMonth).format("x"),
        month: moment(this.startOfMonth).format('MMM'),
     }
     
     this.futureMonths = [1, 2].map(add => {
        const date = moment(this.startOfMonth).add(add, "M")
        const formatted = date.format('YYYY-MM-DD');
        const month = date.format('MMM');
        const unix = +date.format("x");
        return {
           formatted,
           unix,
           month
        }
     });
   }

   changeQueryDate(date: number){
    this.queryDateChanged.emit(date);
   }
}
