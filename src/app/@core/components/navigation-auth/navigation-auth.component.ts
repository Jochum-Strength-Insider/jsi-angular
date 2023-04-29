import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-navigation-auth',
  templateUrl: './navigation-auth.component.html',
  styleUrls: ['./navigation-auth.component.css']
})
export class NavigationAuthComponent implements OnInit {
  @ViewChild('template', { static: true }) template: any;

  constructor(
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input() onSelect: Function;
  @Input() onToggle: Function;
  @Input() collapsed: boolean;
  @Input() authUser: User;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
  }
}
