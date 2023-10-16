import { Component, Input, OnInit } from '@angular/core';
import { Message } from '@app/@core/models/messages/message.model';
import * as moment from 'moment';

@Component({
  selector: 'app-messages-item',
  templateUrl: './messages-item.component.html',
  styleUrls: ['./messages-item.component.css']
})
export class MessagesItemComponent implements OnInit {
  @Input() message: Message;
  @Input() nextMessage: Message | null;
  @Input() prevMessage: Message | null;
  @Input() isSender: boolean;
  @Input() isFirstMessage: boolean;
  @Input() isLastMessage: boolean;
  @Input() days: string[] = [];
  @Input() index: number;

  showDate: boolean = false;
  showName: boolean = false;

  oneDay: number = 86400000;

  dateString: string = '';
  today: string = '';
  fromNow: string = '';
  timeString: string = '';
  recent: boolean = false;

  first: boolean = false;

  ngOnInit(){
    const messageDate = moment(this.message.createdAt);
    this.today = moment().format("MMM DD");

    this.dateString = messageDate.format("MMM DD");
    this.timeString = messageDate.format("hh:mm a")
    this.fromNow = messageDate.fromNow();

    this.recent = moment().diff(moment(this.message.createdAt)) < this.oneDay;

    const uniqueDayIndex = [...new Set(this.days)].map(day => this.days.findIndex(el => el === day))
    const uniqueDayEndIndex = [...new Set(this.days)].map(day => this.days.lastIndexOf(day))

    const firstOfDay = uniqueDayIndex.includes(this.index);
    const lastOfDay = uniqueDayEndIndex.includes(this.index);
    this.first = this.isFirstMessage || firstOfDay;

    const previousIsDifferentSender = this.prevMessage?.userId !== this.message.userId;
    const nextIsDifferentSender = this.nextMessage?.userId !== this.message.userId;

    this.showName = previousIsDifferentSender || this.isFirstMessage || firstOfDay;
    this.showDate = nextIsDifferentSender || (lastOfDay && !this.isLastMessage);
  }
}
