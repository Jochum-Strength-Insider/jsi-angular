import { Component, Input } from '@angular/core';
import { Message } from '@app/@core/models/messages/message.model';

@Component({
  selector: 'app-message-icon',
  templateUrl: './message-icon.component.html',
  styleUrls: ['./message-icon.component.css']
})
export class MessageIconComponent {
  @Input() unread: Message[] = [];
  @Input() uid: string;
}
