import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';

@Component({
  selector: 'app-navigation-auth',
  templateUrl: './navigation-auth.component.html',
  styleUrls: ['./navigation-auth.component.css']
})
export class NavigationAuthComponent implements OnInit {
  @ViewChild('template', { static: true }) template: any;
  @Input() onSelect: Function;
  @Input() onToggle: Function;
  @Input() collapsed: boolean;
  @Input() messages: Message[] = [];
  @Input() authUser: User;
  error: Error;

  constructor(
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
  }
}
