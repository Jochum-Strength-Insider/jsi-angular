import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('template', { static: true }) template: any;

  constructor(
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input() onSelect: Function;
  @Input() onToggle: Function;
  @Input() collapsed: boolean;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
  }
}
