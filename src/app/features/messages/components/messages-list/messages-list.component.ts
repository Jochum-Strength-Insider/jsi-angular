import { Component, Input, SimpleChanges } from '@angular/core';
import { Message } from '@app/@core/models/messages/message.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import * as moment from 'moment';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent {
  @Input() messages: Message[] = [];
  @Input() uid: string;
  days: string[] = [];
 
  ngOnChanges(changes: SimpleChanges){
    ifPropChanged(changes['messages'], () => this.setDaysList())
  }

  setDaysList(){
    this.days = this.messages.map(message => moment(message.createdAt).startOf("D").format("MMM DD").toString());
  }
}
