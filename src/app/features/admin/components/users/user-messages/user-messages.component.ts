import { Component, Input, OnInit } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent implements OnInit {
  @Input() user: User;
  @Input() adminUser: User | null;

  ngOnInit() {
    console.log('user', this.user);
  }
}
